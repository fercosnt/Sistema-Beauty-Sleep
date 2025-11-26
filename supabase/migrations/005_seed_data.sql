-- Migration 005: Seed Data
-- Pre-defined tags and test users

-- Insert pre-defined tags
INSERT INTO tags (nome, cor, tipo) VALUES
  ('Atropina', '#3B82F6', 'protocolo'),
  ('Vonau', '#8B5CF6', 'protocolo'),
  ('Nasal', '#10B981', 'protocolo'),
  ('Palato', '#F59E0B', 'protocolo'),
  ('Língua', '#EF4444', 'protocolo'),
  ('Combinado', '#6366F1', 'protocolo')
ON CONFLICT (nome) DO NOTHING;

-- Note: Test users will be created via Supabase Auth
-- The following users should be created manually in Supabase Auth dashboard:
-- 1. admin@beautysmile.com (role: admin)
-- 2. dentista@beautysmile.com (role: equipe)
-- 3. recepcao@beautysmile.com (role: recepcao)
--
-- After creating users in Auth, insert them into users table:
-- INSERT INTO users (email, nome, role, ativo) VALUES
--   ('admin@beautysmile.com', 'Administrador', 'admin', true),
--   ('dentista@beautysmile.com', 'Dentista Teste', 'equipe', true),
--   ('recepcao@beautysmile.com', 'Recepcionista Teste', 'recepcao', true);

