-- Script para Diagnosticar Falhas do Cron Job
-- 
-- Execute este script no SQL Editor do Supabase para ver detalhes dos erros
--
-- Link: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- 1. Ver Últimas Execuções com Detalhes do Erro
-- ============================================
SELECT 
  runid,
  status,
  return_message,
  start_time,
  end_time,
  (end_time - start_time) as duration
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily')
ORDER BY start_time DESC
LIMIT 10;

-- ============================================
-- 2. Verificar Comando Atual do Cron Job
-- ============================================
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  command,
  CASE 
    WHEN command LIKE '%public.net_http_post%' THEN '✅ Usando wrapper'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Ainda com problema antigo'
    ELSE '⚠️ Verificar'
  END as status_comando
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- 3. Verificar se a Função Wrapper Existe
-- ============================================
SELECT 
  proname as function_name,
  pronargs as num_args,
  prorettype::regtype as return_type
FROM pg_proc
WHERE proname = 'net_http_post'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ============================================
-- 4. Testar a Função Wrapper Manualmente
-- ============================================
-- Execute este comando para testar se a função wrapper funciona
SELECT public.net_http_post(
  url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
  ),
  body := jsonb_build_object('time', now()),
  timeout_milliseconds := 300000
) as request_id;

-- ============================================
-- 5. Verificar Respostas HTTP Recentes
-- ============================================
SELECT 
  id,
  status_code,
  error_msg,
  timed_out,
  created
FROM extensions.net._http_response
WHERE created > NOW() - INTERVAL '24 hours'
ORDER BY created DESC
LIMIT 5;

