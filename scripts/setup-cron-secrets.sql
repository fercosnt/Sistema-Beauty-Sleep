-- Script SQL para configurar secrets do cron job no Supabase Vault
-- 
-- IMPORTANTE: Substitua [YOUR_PROJECT_URL] e [YOUR_ANON_KEY] pelos valores
-- do seu projeto antes de executar este script.
--
-- Você pode encontrar esses valores em:
-- - Dashboard Supabase → Settings → API
-- - Ou no arquivo .env.local (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY)
--
-- Execute este script no SQL Editor do Supabase Dashboard

-- Configurar project_url
SELECT vault.create_secret('[YOUR_PROJECT_URL]', 'project_url');

-- Configurar anon_key
SELECT vault.create_secret('[YOUR_ANON_KEY]', 'anon_key');

-- Verificar se os secrets foram criados
SELECT name FROM vault.decrypted_secrets WHERE name IN ('project_url', 'anon_key');

