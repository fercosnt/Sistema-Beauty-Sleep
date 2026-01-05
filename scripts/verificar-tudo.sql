-- Script para Verificar Tudo e Identificar o Problema
-- 
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- 1. Ver comando completo do cron job
-- ============================================
SELECT 
  'COMANDO COMPLETO:' as tipo,
  command
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- 2. Verificar se há funções wrapper
-- ============================================
SELECT 
  'FUNÇÕES WRAPPER:' as tipo,
  proname as function_name,
  pronamespace::regnamespace as schema
FROM pg_proc
WHERE proname LIKE '%net_http%'
  AND pronamespace != (SELECT oid FROM pg_namespace WHERE nspname = 'extensions');

-- ============================================
-- 3. Verificar extensões
-- ============================================
SELECT 
  'EXTENSÕES:' as tipo,
  extname,
  extnamespace::regnamespace as schema
FROM pg_extension
WHERE extname IN ('pg_net', 'pg_cron');

-- ============================================
-- 4. Testar se net.http_post funciona diretamente
-- ============================================
-- Descomente para testar:
/*
SELECT net.http_post(
  url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
  ),
  body := jsonb_build_object('time', now()),
  timeout_milliseconds := 300000
) as request_id;
*/

