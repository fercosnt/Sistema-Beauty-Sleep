-- Script para deletar usuários de teste do Supabase
-- 
-- ATENÇÃO: Este script deleta usuários de teste. Execute com cuidado!
-- 
-- Como usar:
-- 1. Abra o Supabase Dashboard → SQL Editor
-- 2. Cole este script
-- 3. Revise os emails que serão deletados
-- 4. Execute o script
--
-- IMPORTANTE: Este script deleta apenas usuários com emails de teste.
-- Usuários de produção (admin@beautysmile.com, etc.) NÃO serão deletados.

-- ============================================
-- PARTE 1: Deletar da tabela users
-- ============================================

-- Lista de emails de teste a serem deletados
-- Ajuste esta lista conforme necessário
DO $$
DECLARE
  test_emails TEXT[] := ARRAY[
    'admin@test.com',
    'equipe@test.com',
    'recepcao@test.com',
    'test@test.com',
    'teste@teste.com',
    'user@test.com'
  ];
  email TEXT;
  deleted_count INT := 0;
BEGIN
  -- Deletar usuários da tabela users
  FOREACH email IN ARRAY test_emails
  LOOP
    -- Verificar se usuário existe antes de deletar
    IF EXISTS (SELECT 1 FROM users WHERE users.email = email) THEN
      DELETE FROM users WHERE users.email = email;
      deleted_count := deleted_count + 1;
      RAISE NOTICE 'Usuário deletado da tabela users: %', email;
    ELSE
      RAISE NOTICE 'Usuário não encontrado na tabela users: %', email;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Total de usuários deletados da tabela users: %', deleted_count;
END $$;

-- ============================================
-- PARTE 2: Deletar do Supabase Auth
-- ============================================
-- NOTA: Para deletar do Supabase Auth, você precisa usar a API Admin
-- ou o Dashboard. O SQL abaixo mostra como fazer via SQL (requer permissões especiais)

-- Opção 1: Via SQL (requer permissões de service_role)
-- Descomente apenas se tiver certeza e permissões adequadas
/*
DO $$
DECLARE
  test_emails TEXT[] := ARRAY[
    'admin@test.com',
    'equipe@test.com',
    'recepcao@test.com',
    'test@test.com',
    'teste@teste.com',
    'user@test.com'
  ];
  email TEXT;
  auth_user_id UUID;
  deleted_count INT := 0;
BEGIN
  FOREACH email IN ARRAY test_emails
  LOOP
    -- Buscar ID do usuário no auth.users
    SELECT id INTO auth_user_id
    FROM auth.users
    WHERE email = email;
    
    IF auth_user_id IS NOT NULL THEN
      -- Deletar do auth.users
      DELETE FROM auth.users WHERE id = auth_user_id;
      deleted_count := deleted_count + 1;
      RAISE NOTICE 'Usuário deletado do auth.users: % (ID: %)', email, auth_user_id;
    ELSE
      RAISE NOTICE 'Usuário não encontrado no auth.users: %', email;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Total de usuários deletados do auth.users: %', deleted_count;
END $$;
*/

-- ============================================
-- PARTE 3: Verificar usuários restantes
-- ============================================

-- Listar todos os usuários restantes na tabela users
SELECT 
  id,
  email,
  nome,
  role,
  ativo,
  created_at
FROM users
ORDER BY created_at DESC;

-- ============================================
-- PARTE 4: Deletar por padrão (opcional)
-- ============================================
-- Se você quiser deletar TODOS os usuários que contêm "test" no email:

/*
DELETE FROM users 
WHERE email ILIKE '%test%' 
  AND email NOT IN (
    -- Lista de emails de produção que NÃO devem ser deletados
    'admin@beautysmile.com',
    'dentista@beautysmile.com',
    'recepcao@beautysmile.com'
  );
*/

-- ============================================
-- PARTE 5: Deletar usuários inativos (opcional)
-- ============================================
-- Se você quiser deletar apenas usuários inativos de teste:

/*
DELETE FROM users 
WHERE ativo = false
  AND email ILIKE '%test%'
  AND email NOT IN (
    -- Lista de emails de produção que NÃO devem ser deletados
    'admin@beautysmile.com',
    'dentista@beautysmile.com',
    'recepcao@beautysmile.com'
  );
*/

-- ============================================
-- INSTRUÇÕES PARA DELETAR DO SUPABASE AUTH
-- ============================================
-- 
-- Para deletar usuários do Supabase Auth (auth.users), você tem 3 opções:
--
-- OPÇÃO 1: Via Dashboard (Recomendado)
-- 1. Vá em Authentication → Users
-- 2. Busque pelo email do usuário
-- 3. Clique nos 3 pontos (...) → Delete user
--
-- OPÇÃO 2: Via API Admin (Programático)
-- Use o script TypeScript em scripts/delete-test-users.ts
--
-- OPÇÃO 3: Via SQL (Apenas se tiver permissões service_role)
-- Descomente a PARTE 2 acima e execute
--
-- IMPORTANTE: Sempre delete primeiro da tabela users, depois do auth.users
-- para evitar problemas de referência

