-- Script para verificar se um paciente ainda está na base de dados
-- Use este script para verificar pacientes antes ou depois de deletar

-- ============================================
-- 1. Verificar por ID do paciente
-- ============================================
-- IMPORTANTE: Substitua '00000000-0000-0000-0000-000000000000' por um UUID válido
-- Exemplo de UUID válido: '5896b077-7e53-4507-8828-aafdcbdab22c'
-- Você pode encontrar o ID na URL do perfil do paciente ou na primeira query abaixo
SELECT 
  id,
  nome,
  cpf,
  biologix_id,
  status,
  email,
  telefone,
  created_at,
  updated_at
FROM pacientes
WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;

-- ============================================
-- 2. Verificar por CPF
-- ============================================
-- Substitua '00000000000' pelo CPF (sem máscara)
SELECT 
  id,
  nome,
  cpf,
  biologix_id,
  status,
  email,
  telefone,
  created_at
FROM pacientes
WHERE cpf = '00000000000';

-- ============================================
-- 3. Verificar por biologix_id
-- ============================================
-- Substitua 'SEU_BIOLOGIX_ID_AQUI' pelo biologix_id
SELECT 
  id,
  nome,
  cpf,
  biologix_id,
  status,
  email,
  telefone,
  created_at
FROM pacientes
WHERE biologix_id = 'SEU_BIOLOGIX_ID_AQUI';

-- ============================================
-- 4. Verificar por nome (busca parcial)
-- ============================================
-- Substitua 'Nome do Paciente' pelo nome (ou parte do nome)
SELECT 
  id,
  nome,
  cpf,
  biologix_id,
  status,
  email,
  telefone,
  created_at
FROM pacientes
WHERE nome ILIKE '%Nome do Paciente%'
ORDER BY nome;

-- ============================================
-- 5. Verificar dados relacionados do paciente
-- ============================================
-- Verifica exames, sessões e notas do paciente
-- Substitua 'SEU_PACIENTE_ID_AQUI' pelo ID do paciente

-- Exames do paciente
SELECT 
  COUNT(*) as total_exames,
  MIN(data_exame) as primeiro_exame,
  MAX(data_exame) as ultimo_exame
FROM exames
WHERE paciente_id = 'SEU_PACIENTE_ID_AQUI';

-- Sessões do paciente
SELECT 
  COUNT(*) as total_sessoes,
  MIN(data_sessao) as primeira_sessao,
  MAX(data_sessao) as ultima_sessao
FROM sessoes
WHERE paciente_id = 'SEU_PACIENTE_ID_AQUI';

-- Notas do paciente
SELECT 
  COUNT(*) as total_notas,
  MIN(created_at) as primeira_nota,
  MAX(created_at) as ultima_nota
FROM notas
WHERE paciente_id = 'SEU_PACIENTE_ID_AQUI';

-- Tags do paciente
SELECT 
  t.nome as tag_nome,
  t.cor as tag_cor,
  pt.created_at as atribuida_em
FROM paciente_tags pt
JOIN tags t ON t.id = pt.tag_id
WHERE pt.paciente_id = 'SEU_PACIENTE_ID_AQUI';

-- ============================================
-- 6. Verificar se paciente foi deletado (por ID)
-- ============================================
-- IMPORTANTE: Substitua '00000000-0000-0000-0000-000000000000' por um UUID válido
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pacientes WHERE id = '00000000-0000-0000-0000-000000000000'::uuid) 
    THEN '✅ Paciente AINDA EXISTE na base de dados'
    ELSE '❌ Paciente NÃO EXISTE mais na base de dados'
  END as status_paciente;

-- ============================================
-- 6b. Verificar se paciente foi deletado (por NOME - mais fácil)
-- ============================================
-- Substitua 'Nome do Paciente' pelo nome (ou parte do nome)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pacientes WHERE nome ILIKE '%Nome do Paciente%') 
    THEN '✅ Paciente AINDA EXISTE na base de dados'
    ELSE '❌ Paciente NÃO EXISTE mais na base de dados'
  END as status_paciente,
  (SELECT COUNT(*) FROM pacientes WHERE nome ILIKE '%Nome do Paciente%') as total_encontrados;

-- ============================================
-- 7. Listar todos os pacientes (útil para encontrar IDs)
-- ============================================
SELECT 
  id,
  nome,
  cpf,
  biologix_id,
  status,
  created_at
FROM pacientes
ORDER BY nome
LIMIT 100;

-- ============================================
-- 8. Verificar pacientes deletados recentemente
-- ============================================
-- Nota: Esta query só funciona se você tiver uma tabela de log de auditoria
-- Se não tiver, não será possível ver pacientes deletados
SELECT 
  id,
  paciente_id,
  acao,
  dados_anteriores,
  created_at
FROM audit_logs
WHERE acao = 'DELETE' 
  AND tabela = 'pacientes'
ORDER BY created_at DESC
LIMIT 20;

