-- Script para Verificar Resultados da Sincronização
-- 
-- Execute estes comandos no SQL Editor do Supabase para verificar
-- se a sincronização funcionou corretamente
--
-- Link: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- 1. Verificar Última Execução do Cron Job
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
LIMIT 1;

-- ============================================
-- 2. Verificar Respostas HTTP Recentes
-- ============================================
SELECT 
  id,
  status_code,
  CASE 
    WHEN status_code = 200 THEN '✅ Sucesso'
    WHEN status_code >= 400 THEN '❌ Erro'
    ELSE '⚠️ Verificar'
  END as status,
  error_msg,
  timed_out,
  created
FROM extensions.net._http_response
WHERE created > NOW() - INTERVAL '10 minutes'
ORDER BY created DESC
LIMIT 5;

-- ============================================
-- 3. Ver Conteúdo da Resposta HTTP (última)
-- ============================================
-- Descomente e execute para ver o JSON completo da resposta
-- SELECT content::jsonb FROM extensions.net._http_response 
-- WHERE created > NOW() - INTERVAL '10 minutes'
-- ORDER BY created DESC LIMIT 1;

-- ============================================
-- 4. Verificar Exames Sincronizados Recentemente
-- ============================================
SELECT 
  e.id,
  e.biologix_exam_id,
  e.data_exame,
  CASE 
    WHEN e.tipo = 0 THEN 'Ronco'
    WHEN e.tipo = 1 THEN 'Sono'
    ELSE 'Outro'
  END as tipo_exame,
  p.nome as paciente_nome,
  p.status as paciente_status,
  e.created_at as sincronizado_em
FROM exames e
JOIN pacientes p ON e.paciente_id = p.id
WHERE e.created_at > NOW() - INTERVAL '10 minutes'
ORDER BY e.created_at DESC
LIMIT 20;

-- ============================================
-- 5. Estatísticas da Sincronização de Hoje
-- ============================================
SELECT 
  COUNT(*) as total_exames_hoje,
  COUNT(DISTINCT e.paciente_id) as pacientes_afetados,
  COUNT(DISTINCT CASE WHEN e.created_at > NOW() - INTERVAL '10 minutes' THEN e.id END) as exames_ultimos_10min,
  MIN(e.created_at) as primeira_sincronizacao_hoje,
  MAX(e.created_at) as ultima_sincronizacao_hoje
FROM exames e
WHERE e.created_at::date = CURRENT_DATE;

-- ============================================
-- 6. Verificar Novos Pacientes Criados (Leads)
-- ============================================
SELECT 
  p.id,
  p.nome,
  p.cpf,
  p.email,
  p.status,
  p.biologix_id,
  p.created_at,
  COUNT(e.id) as total_exames
FROM pacientes p
LEFT JOIN exames e ON e.paciente_id = p.id
WHERE p.created_at > NOW() - INTERVAL '10 minutes'
  AND p.status = 'lead'
GROUP BY p.id, p.nome, p.cpf, p.email, p.status, p.biologix_id, p.created_at
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================
-- 7. Resumo Geral
-- ============================================
SELECT 
  (SELECT COUNT(*) FROM exames) as total_exames_sistema,
  (SELECT COUNT(*) FROM exames WHERE created_at::date = CURRENT_DATE) as exames_hoje,
  (SELECT COUNT(*) FROM pacientes WHERE status = 'lead') as total_leads,
  (SELECT COUNT(*) FROM pacientes WHERE created_at::date = CURRENT_DATE AND status = 'lead') as leads_hoje,
  (SELECT MAX(created_at) FROM exames) as ultima_sincronizacao;

