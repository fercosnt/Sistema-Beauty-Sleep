-- Script simples para deletar usuários com "teste" no nome
-- Cole este código no Supabase SQL Editor e execute

-- Deletar da tabela users onde o nome contém "teste" (case-insensitive)
DELETE FROM users 
WHERE nome ILIKE '%teste%'
  -- Proteção: não deletar emails de produção
  AND email NOT IN (
    'admin@beautysmile.com',
    'dentista@beautysmile.com',
    'recepcao@beautysmile.com'
  );

-- Verificar quantos foram deletados
SELECT COUNT(*) as usuarios_deletados
FROM users 
WHERE nome ILIKE '%teste%';

-- Listar usuários restantes
SELECT id, email, nome, role, ativo, created_at
FROM users
ORDER BY created_at DESC;

