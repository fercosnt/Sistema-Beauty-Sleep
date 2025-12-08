-- Script para criar usuário na tabela users
-- Execute após criar o usuário no Supabase Auth Dashboard

-- IMPORTANTE: Substitua os valores abaixo pelos dados do seu usuário
-- - [EMAIL]: Email do usuário criado no Auth (deve ser exatamente o mesmo)
-- - [NOME]: Nome completo do usuário
-- - [ROLE]: 'admin', 'equipe' ou 'recepcao'

INSERT INTO users (email, nome, role, ativo)
VALUES (
  '[EMAIL]',           -- Substitua pelo email do usuário criado no Auth
  '[NOME]',            -- Substitua pelo nome do usuário
  '[ROLE]',            -- Substitua por: 'admin', 'equipe' ou 'recepcao'
  true                 -- Usuário ativo
)
ON CONFLICT (email) DO UPDATE
SET 
  nome = EXCLUDED.nome,
  role = EXCLUDED.role,
  ativo = EXCLUDED.ativo;

-- Exemplo de uso:
-- INSERT INTO users (email, nome, role, ativo)
-- VALUES (
--   'usuario@beautysmile.com',
--   'Nome do Usuário',
--   'equipe',
--   true
-- )
-- ON CONFLICT (email) DO UPDATE
-- SET 
--   nome = EXCLUDED.nome,
--   role = EXCLUDED.role,
--   ativo = EXCLUDED.ativo;

-- Verificar se foi criado corretamente:
-- SELECT id, email, nome, role, ativo, created_at FROM users WHERE email = '[EMAIL]';

