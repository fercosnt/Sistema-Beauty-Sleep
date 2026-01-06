-- Script para Verificar Resposta HTTP (sem qualificação de schema)
-- 
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- Verificar Resposta HTTP (usando sem qualificação de schema)
-- ============================================
SELECT 
  id,
  status_code,
  error_msg,
  timed_out,
  created
FROM net._http_response
WHERE created > NOW() - INTERVAL '2 minutes'
ORDER BY created DESC
LIMIT 1;

-- ============================================
-- Ver Conteúdo Completo da Resposta (se necessário)
-- ============================================
-- Descomente para ver o JSON completo:
-- SELECT 
--   id,
--   status_code,
--   content::jsonb,
--   error_msg,
--   created
-- FROM net._http_response
-- WHERE created > NOW() - INTERVAL '2 minutes'
-- ORDER BY created DESC
-- LIMIT 1;

-- ============================================
-- Ver Todas as Respostas HTTP Recentes
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
FROM net._http_response
WHERE created > NOW() - INTERVAL '10 minutes'
ORDER BY created DESC
LIMIT 5;

