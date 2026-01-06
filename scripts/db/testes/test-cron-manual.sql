-- Script para Testar o Cron Job Manualmente
-- 
-- Execute este script no SQL Editor do Supabase para testar a execução do cron job
-- sem esperar o horário agendado (10h BRT / 13h UTC)
--
-- Link: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- OPÇÃO 1: Executar via cron.run_job
-- ============================================
-- Esta opção executa o cron job imediatamente
SELECT cron.run_job(
  (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily')
);

-- ============================================
-- OPÇÃO 2: Verificar Status Antes de Executar
-- ============================================
-- Verifique se o cron job está ativo antes de executar
SELECT 
  jobid,
  jobname,
  active,
  schedule,
  CASE 
    WHEN command LIKE '%public.net_http_post%' THEN '✅ Corrigido'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Com problema'
    ELSE '⚠️ Verificar'
  END as status
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- OPÇÃO 3: Executar o Comando do Cron Manualmente
-- ============================================
-- Esta opção executa o comando HTTP diretamente
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
-- Verificar Resposta HTTP
-- ============================================
-- Após executar, verifique a resposta (substitua [request_id] pelo ID retornado)
-- SELECT * FROM extensions.net._http_response WHERE id = [request_id];

-- ============================================
-- Verificar Última Execução
-- ============================================
-- Verifique se a execução foi bem-sucedida
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
LIMIT 1;

-- ============================================
-- Verificar Exames Sincronizados Recentemente
-- ============================================
-- Veja os exames que foram sincronizados nas últimas horas
SELECT 
  e.id,
  e.biologix_exam_id,
  e.data_exame,
  e.tipo,
  p.nome as paciente_nome,
  e.created_at
FROM exames e
JOIN pacientes p ON e.paciente_id = p.id
WHERE e.created_at > NOW() - INTERVAL '2 hours'
ORDER BY e.created_at DESC
LIMIT 10;

