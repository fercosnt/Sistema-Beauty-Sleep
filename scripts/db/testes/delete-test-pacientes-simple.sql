-- Script simples para deletar pacientes com "teste" no nome
-- Cole este código no Supabase SQL Editor e execute

-- Deletar da tabela pacientes onde o nome contém "teste" (case-insensitive)
DELETE FROM pacientes 
WHERE nome ILIKE '%teste%';

-- Verificar quantos foram deletados
SELECT COUNT(*) as pacientes_deletados
FROM pacientes 
WHERE nome ILIKE '%teste%';

-- Listar pacientes restantes (últimos 10)
SELECT id, biologix_id, nome, cpf, status, created_at
FROM pacientes
ORDER BY created_at DESC
LIMIT 10;

