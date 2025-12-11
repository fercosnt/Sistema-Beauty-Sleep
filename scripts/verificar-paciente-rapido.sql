-- Script RÁPIDO para verificar se um paciente existe
-- Copie e cole no Supabase SQL Editor, substituindo os valores

-- ============================================
-- VERIFICAÇÃO RÁPIDA POR NOME OU CPF
-- ============================================
-- Substitua 'Nome ou CPF' pelo que você quer buscar

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
-- VERIFICAR SE EXISTE (retorna SIM ou NÃO)
-- ============================================
-- Substitua 'ID_DO_PACIENTE' pelo ID do paciente

SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pacientes WHERE id = 'ID_DO_PACIENTE') 
    THEN '✅ SIM - Paciente AINDA EXISTE'
    ELSE '❌ NÃO - Paciente NÃO EXISTE mais'
  END as paciente_existe;

