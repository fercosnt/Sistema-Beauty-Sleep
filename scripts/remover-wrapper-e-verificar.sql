-- Script para Remover Função Wrapper e Garantir que Cron Job Usa net.http_post Diretamente
-- 
-- PROBLEMA: A função wrapper net_http_post ainda existe e está causando erro
-- SOLUÇÃO: Remover a função wrapper e garantir que o cron job usa net.http_post diretamente
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- PASSO 1: Remover função wrapper antiga
-- ============================================
DROP FUNCTION IF EXISTS public.net_http_post(TEXT, JSONB, JSONB, INTEGER);

-- ============================================
-- PASSO 2: Verificar se foi removida
-- ============================================
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Função wrapper removida'
    ELSE '❌ Função wrapper ainda existe'
  END as status
FROM pg_proc
WHERE proname = 'net_http_post'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ============================================
-- PASSO 3: Verificar comando atual do cron job
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  command,
  CASE 
    WHEN command LIKE '%net.http_post%' AND command NOT LIKE '%net_http_post%' AND command NOT LIKE '%extensions.%' THEN '✅ Usando net.http_post diretamente (correto)'
    WHEN command LIKE '%net_http_post%' THEN '❌ Ainda usando função wrapper (precisa corrigir)'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Usando extensions.net.http_post (precisa corrigir)'
    ELSE '⚠️ Verificar manualmente'
  END as status
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- PASSO 4: Se o status mostrar problema, atualizar o cron job
-- ============================================
DO $update_cron$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'sync-biologix-daily';
  
  IF job_id IS NOT NULL THEN
    -- Garantir que está usando net.http_post diretamente (sem função wrapper, sem qualificação)
    cmd_text := 'SELECT net.http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) as request_id;';
    
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    
    RAISE NOTICE '✅ Cron job atualizado para usar net.http_post diretamente!';
  END IF;
END;
$update_cron$;

-- ============================================
-- PASSO 5: Verificar novamente após atualização
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  CASE 
    WHEN command LIKE '%net.http_post%' AND command NOT LIKE '%net_http_post%' AND command NOT LIKE '%extensions.%' THEN '✅ CORRETO - Usando net.http_post diretamente'
    WHEN command LIKE '%net_http_post%' THEN '❌ Ainda usando função wrapper'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Ainda usando extensions.net.http_post'
    ELSE '⚠️ Verificar'
  END as status_final,
  LEFT(command, 150) as command_preview
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

