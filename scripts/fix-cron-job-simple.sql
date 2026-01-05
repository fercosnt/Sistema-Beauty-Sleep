-- Script de Correção: Cron Job sync-biologix-daily
-- 
-- Este script corrige o erro:
-- ERROR: cross-database references are not implemented: extensions.net.http_post
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- PASSO 1: Criar função wrapper no schema public
-- ============================================
CREATE OR REPLACE FUNCTION public.net_http_post(
  url TEXT,
  headers JSONB DEFAULT '{}'::JSONB,
  body JSONB DEFAULT '{}'::JSONB,
  timeout_milliseconds INTEGER DEFAULT 300000
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = extensions, public
AS $$
BEGIN
  RETURN extensions.net.http_post(
    url := url,
    headers := headers,
    body := body,
    timeout_milliseconds := timeout_milliseconds
  );
END;
$$;

-- ============================================
-- PASSO 2: Conceder permissões
-- ============================================
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO anon;

-- ============================================
-- PASSO 3: Atualizar o cron job
-- ============================================
-- Nota: Usando delimitadores diferentes para evitar conflito
DO $update_cron$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  -- Encontrar o cron job
  SELECT jobid INTO job_id
  FROM cron.job
  WHERE jobname = 'sync-biologix-daily';
  
  -- Se o job existe, atualizar para usar a função wrapper
  IF job_id IS NOT NULL THEN
    -- Construir o comando do cron job
    cmd_text := 'SELECT public.net_http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) as request_id;';
    
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    
    RAISE NOTICE '✅ Cron job sync-biologix-daily atualizado com sucesso!';
  ELSE
    RAISE WARNING '❌ Cron job sync-biologix-daily não encontrado';
  END IF;
END;
$update_cron$;

-- ============================================
-- PASSO 4: Verificar se foi atualizado corretamente
-- ============================================
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  CASE 
    WHEN command LIKE '%public.net_http_post%' THEN '✅ Corrigido (usando wrapper)'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Ainda com problema'
    ELSE '⚠️ Verificar manualmente'
  END as status
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

