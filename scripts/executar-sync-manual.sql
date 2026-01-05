-- Script para Executar Sincronização Manualmente
-- 
-- Execute este script no SQL Editor do Supabase para testar a sincronização
-- sem esperar o horário agendado (10h BRT / 13h UTC)
--
-- Link: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- OPÇÃO 1: Executar o Comando do Cron Manualmente (RECOMENDADO)
-- ============================================
-- Esta opção executa o mesmo comando que o cron job executa
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
-- Após executar o comando acima, você receberá um request_id
-- Use esse ID para verificar a resposta (substitua [request_id] pelo ID retornado)
-- 
-- Exemplo: Se o request_id foi 12345, execute:
-- SELECT * FROM extensions.net._http_response WHERE id = 12345;
--
-- Ou veja a última resposta:
SELECT 
  id,
  status_code,
  content_type,
  headers,
  content,
  timed_out,
  error_msg,
  created
FROM extensions.net._http_response
WHERE created > NOW() - INTERVAL '5 minutes'
ORDER BY created DESC
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
  e.created_at,
  CASE 
    WHEN e.tipo = 0 THEN 'Ronco'
    WHEN e.tipo = 1 THEN 'Sono'
    ELSE 'Outro'
  END as tipo_exame
FROM exames e
JOIN pacientes p ON e.paciente_id = p.id
WHERE e.created_at > NOW() - INTERVAL '10 minutes'
ORDER BY e.created_at DESC
LIMIT 20;

-- ============================================
-- Verificar Estatísticas da Sincronização
-- ============================================
-- Veja quantos exames foram sincronizados hoje
SELECT 
  COUNT(*) as total_exames_hoje,
  COUNT(DISTINCT paciente_id) as pacientes_afetados,
  MIN(created_at) as primeira_sincronizacao_hoje,
  MAX(created_at) as ultima_sincronizacao_hoje
FROM exames
WHERE created_at::date = CURRENT_DATE;

