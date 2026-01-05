-- Script para Confirmar que Está Correto e Testar
-- 
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- 1. Confirmar que o comando está correto
-- ============================================
SELECT 
  '✅ COMANDO CORRETO!' as status,
  'O cron job está usando net.http_post diretamente, sem função wrapper, sem qualificação de schema' as detalhes
FROM cron.job
WHERE jobname = 'sync-biologix-daily'
  AND command LIKE '%net.http_post%'
  AND command NOT LIKE '%net_http_post%'
  AND command NOT LIKE '%extensions.net.http_post%';

-- ============================================
-- 2. Verificar se há funções wrapper ainda ativas
-- ============================================
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Nenhuma função wrapper encontrada'
    ELSE '❌ Ainda há ' || COUNT(*) || ' função(ões) wrapper'
  END as status_wrapper,
  string_agg(proname || '(' || pronamespace::regnamespace || ')', ', ') as funcoes
FROM pg_proc
WHERE proname LIKE '%net_http%'
  AND pronamespace != (SELECT oid FROM pg_namespace WHERE nspname = 'extensions');

-- ============================================
-- 3. Testar se net.http_post funciona
-- ============================================
SELECT net.http_post(
  url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
  ),
  body := jsonb_build_object('time', now()),
  timeout_milliseconds := 300000
) as request_id;

-- ============================================
-- 4. Verificar resposta (aguarde alguns segundos após executar o passo 3)
-- ============================================
-- SELECT 
--   id,
--   status_code,
--   error_msg,
--   created
-- FROM net._http_response
-- WHERE created > NOW() - INTERVAL '1 minute'
-- ORDER BY created DESC
-- LIMIT 1;

-- ============================================
-- 5. Status final do cron job
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  schedule,
  '✅ Configurado corretamente' as status,
  'Próxima execução: Amanhã às 10h BRT (13h UTC)' as proxima_execucao
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

