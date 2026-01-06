-- Script para FORÇAR Correção do Cron Job
-- 
-- Este script remove a função wrapper e força o cron job a usar net.http_post diretamente
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- PASSO 1: Remover TODAS as funções wrapper que possam existir
-- ============================================
DROP FUNCTION IF EXISTS public.net_http_post(TEXT, JSONB, JSONB, INTEGER);
DROP FUNCTION IF EXISTS public.net_http_post CASCADE;

-- ============================================
-- PASSO 2: Verificar se foi removida
-- ============================================
SELECT 
  'Funções wrapper removidas' as status,
  COUNT(*) as funcoes_restantes
FROM pg_proc
WHERE proname = 'net_http_post'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ============================================
-- PASSO 3: FORÇAR atualização do cron job
-- ============================================
DO $force_update$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'sync-biologix-daily';
  
  IF job_id IS NOT NULL THEN
    -- Comando EXATO usando net.http_post diretamente (sem função wrapper, sem qualificação)
    cmd_text := 'SELECT net.http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) as request_id;';
    
    -- Atualizar o cron job
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    
    RAISE NOTICE '✅ Cron job FORÇADO a usar net.http_post diretamente!';
  ELSE
    RAISE WARNING '❌ Cron job não encontrado!';
  END IF;
END;
$force_update$;

-- ============================================
-- PASSO 4: Verificar resultado
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  CASE 
    WHEN command LIKE '%net.http_post%' 
         AND command NOT LIKE '%net_http_post%' 
         AND command NOT LIKE '%extensions.%'
         AND command NOT LIKE '%public.%' THEN '✅ CORRETO - Usando net.http_post diretamente'
    WHEN command LIKE '%net_http_post%' THEN '❌ Ainda tem net_http_post (função wrapper)'
    WHEN command LIKE '%extensions.%' THEN '❌ Ainda tem extensions.'
    WHEN command LIKE '%public.%' THEN '❌ Ainda tem public.'
    ELSE '⚠️ Padrão não reconhecido - ver comando completo'
  END as status_detalhado,
  LEFT(command, 200) as command_preview
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- PASSO 5: Mostrar comando completo (se necessário)
-- ============================================
-- Descomente para ver o comando completo:
-- SELECT command FROM cron.job WHERE jobname = 'sync-biologix-daily';

