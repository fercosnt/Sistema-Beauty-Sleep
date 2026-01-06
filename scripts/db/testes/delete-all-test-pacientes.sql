-- Script para DELETAR TODOS os pacientes de teste
-- ATENÇÃO: Este script deleta pacientes e TODOS os dados relacionados (exames, sessões, etc.)
-- Execute com cuidado!

-- ============================================================================
-- PASSO 1: VERIFICAR O QUE SERÁ DELETADO (EXECUTE PRIMEIRO PARA VER)
-- ============================================================================

-- Listar pacientes de teste que serão deletados
SELECT 
  p.id,
  p.nome,
  p.cpf,
  p.email,
  p.status,
  p.created_at,
  (SELECT COUNT(*) FROM exames WHERE paciente_id = p.id) as total_exames,
  (SELECT COUNT(*) FROM sessoes WHERE paciente_id = p.id) as total_sessoes
FROM pacientes p
WHERE 
  -- Nomes que começam com "E2E Test" (testes E2E)
  p.nome ILIKE 'E2E Test%' 
  -- Ou contém "teste" no nome (case-insensitive)
  OR p.nome ILIKE '%teste%'
  -- Ou email de teste
  OR p.email ILIKE '%test%'
  OR p.email ILIKE '%e2e%'
ORDER BY p.created_at DESC;

-- Contar quantos serão deletados
SELECT 
  COUNT(*) as total_pacientes_teste,
  COUNT(CASE WHEN nome ILIKE 'E2E Test%' THEN 1 END) as pacientes_e2e,
  COUNT(CASE WHEN nome ILIKE '%teste%' THEN 1 END) as pacientes_com_teste_no_nome,
  COUNT(CASE WHEN email ILIKE '%test%' OR email ILIKE '%e2e%' THEN 1 END) as pacientes_com_email_teste
FROM pacientes
WHERE 
  nome ILIKE 'E2E Test%' 
  OR nome ILIKE '%teste%'
  OR email ILIKE '%test%'
  OR email ILIKE '%e2e%';

-- ============================================================================
-- PASSO 2: DELETAR (EXECUTE APENAS DEPOIS DE VERIFICAR!)
-- ============================================================================

-- Deletar TODOS os pacientes de teste
-- CASCADE vai deletar automaticamente: exames, sessoes, notas, tags, histórico, etc.
DELETE FROM pacientes 
WHERE 
  -- Nomes que começam com "E2E Test" (testes E2E)
  nome ILIKE 'E2E Test%' 
  -- Ou contém "teste" no nome (case-insensitive)
  OR nome ILIKE '%teste%'
  -- Ou email de teste
  OR email ILIKE '%test%'
  OR email ILIKE '%e2e%';

-- ============================================================================
-- PASSO 3: VERIFICAR O RESULTADO
-- ============================================================================

-- Verificar quantos pacientes de teste restam (deve ser 0)
SELECT COUNT(*) as pacientes_teste_restantes
FROM pacientes
WHERE 
  nome ILIKE 'E2E Test%' 
  OR nome ILIKE '%teste%'
  OR email ILIKE '%test%'
  OR email ILIKE '%e2e%';

-- Listar os últimos 10 pacientes (para confirmar que não deletou pacientes reais)
SELECT id, nome, cpf, email, status, created_at
FROM pacientes
ORDER BY created_at DESC
LIMIT 10;

