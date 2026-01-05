-- Script para Verificar e Corrigir o Cron Job
-- 
-- Execute este script no SQL Editor do Supabase
--
-- Link: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- 1. Verificar Status Atual do Cron Job
-- ============================================
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  LEFT(command, 200) as command_preview,
  CASE 
    WHEN command LIKE '%public.net_http_post%' THEN '✅ Corrigido'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Precisa corrigir'
    ELSE '⚠️ Verificar'
  END as status
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- 2. Se o status mostrar "❌ Precisa corrigir", execute este bloco:
-- ============================================
-- (Descomente as linhas abaixo se necessário)

/*
DO $update_cron$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  SELECT jobid INTO job_id
  FROM cron.job
  WHERE jobname = 'sync-biologix-daily';
  
  IF job_id IS NOT NULL THEN
    cmd_text := 'SELECT public.net_http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) as request_id;';
    
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    
    RAISE NOTICE '✅ Cron job atualizado com sucesso!';
  END IF;
END;
$update_cron$;
*/

-- ============================================
-- 3. Verificar se a Função Wrapper Existe
-- ============================================
SELECT 
  'Função wrapper existe' as status,
  proname as function_name
FROM pg_proc
WHERE proname = 'net_http_post'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
UNION ALL
SELECT 
  'Função wrapper NÃO existe' as status,
  'net_http_post' as function_name
WHERE NOT EXISTS (
  SELECT 1 FROM pg_proc
  WHERE proname = 'net_http_post'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
);

-- ============================================
-- 4. Se a função wrapper não existir, execute:
-- ============================================
-- (Descomente se necessário)

/*
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

GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO anon;
*/

