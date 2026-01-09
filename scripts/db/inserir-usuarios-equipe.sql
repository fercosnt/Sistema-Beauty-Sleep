-- Script para inserir usuários da equipe na tabela users
-- Execute este script no Supabase Dashboard → SQL Editor
-- 
-- Usuários criados no Auth que precisam ser inseridos na tabela users:
-- - Todos com role 'equipe'
-- - Todos com ativo = true

INSERT INTO users (email, nome, role, ativo) VALUES
  ('sabadinibeatriz55@gmail.com', 'Beatriz Sabadini', 'equipe', true),
  ('brendaandako@icloud.com', 'Brenda Andako', 'equipe', true),
  ('carol.miclos@icloud.com', 'Carol Miclos', 'equipe', true),
  ('giovannaferguim@gmail.com', 'Giovanna Ferguim', 'equipe', true),
  ('dra.iancadias@gmail.com', 'Dra. Ianca Dias', 'equipe', true),
  ('karinasouzafarias7@gmail.com', 'Karina Souza Farias', 'equipe', true),
  ('laisalves1808@gmail.com', 'Lais Alves', 'equipe', true),
  ('eduarda.lopes@beautysmile.com.br', 'Eduarda Lopes', 'equipe', true)
ON CONFLICT (email) 
DO UPDATE SET 
  nome = EXCLUDED.nome,
  role = EXCLUDED.role,
  ativo = EXCLUDED.ativo;

-- Verificar se os usuários foram inseridos corretamente
SELECT email, nome, role, ativo, created_at 
FROM Users 
WHERE email IN (
  'sabadinibeatriz55@gmail.com',
  'brendaandako@icloud.com',
  'carol.miclos@icloud.com',
  'giovannaferguim@gmail.com',
  'dra.iancadias@gmail.com',
  'karinasouzafarias7@gmail.com',
  'laisalves1808@gmail.com',
  'eduarda.lopes@beautysmile.com.br'
)
ORDER BY nome;

