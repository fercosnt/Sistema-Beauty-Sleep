-- Script RÁPIDO para verificar se um paciente existe
-- Copie e cole no Supabase SQL Editor, substituindo os valores

-- ============================================
-- VERIFICAÇÃO RÁPIDA POR NOME OU CPF
-- ============================================
-- IMPORTANTE: Substitua 'Nome ou CPF' pelo que você quer buscar
-- Exemplo: '%João Silva%' ou '12345678900'

SELECT 
  id,
  nome,
  cpf,
  biologix_id,
  status,
  email,
  created_at,
  -- Contar dados relacionados
  (SELECT COUNT(*) FROM exames WHERE paciente_id = pacientes.id) as total_exames,
  (SELECT COUNT(*) FROM sessoes WHERE paciente_id = pacientes.id) as total_sessoes,
  (SELECT COUNT(*) FROM notas WHERE paciente_id = pacientes.id) as total_notas
FROM pacientes
WHERE 
  nome ILIKE '%Nome ou CPF%' 
  OR cpf LIKE '%Nome ou CPF%'
  OR biologix_id LIKE '%Nome ou CPF%'
ORDER BY nome;

-- ============================================
-- VERIFICAR SE EXISTE POR ID (retorna SIM ou NÃO)
-- ============================================
-- IMPORTANTE: Substitua o UUID abaixo pelo ID real do paciente
-- Exemplo de UUID válido: '5896b077-7e53-4507-8828-aafdcbdab22c'
-- Você pode encontrar o ID na primeira query acima ou na URL do perfil do paciente

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pacientes WHERE id = '00000000-0000-0000-0000-000000000000'::uuid) 
    THEN '✅ SIM - Paciente AINDA EXISTE'
    ELSE '❌ NÃO - Paciente NÃO EXISTE mais'
  END as paciente_existe;

-- ============================================
-- VERIFICAR SE EXISTE POR NOME (mais fácil de usar)
-- ============================================
-- Substitua 'Nome do Paciente' pelo nome exato ou parcial

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pacientes WHERE nome ILIKE '%Nome do Paciente%') 
    THEN '✅ SIM - Paciente AINDA EXISTE'
    ELSE '❌ NÃO - Paciente NÃO EXISTE mais'
  END as paciente_existe,
  (SELECT COUNT(*) FROM pacientes WHERE nome ILIKE '%Nome do Paciente%') as total_encontrados;

