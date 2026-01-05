-- Script para Corrigir a Função Wrapper
-- 
-- PROBLEMA: A função wrapper não pode chamar extensions.net.http_post diretamente
-- SOLUÇÃO: Usar search_path corretamente e chamar sem qualificação de schema
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- PASSO 1: Recriar a função wrapper corretamente
-- ============================================
-- A função precisa ter o schema extensions no search_path ANTES de ser criada
-- e chamar a função sem qualificação de schema

DROP FUNCTION IF EXISTS public.net_http_post(TEXT, JSONB, JSONB, INTEGER);

-- Criar função com search_path configurado na definição
CREATE FUNCTION public.net_http_post(
  url TEXT,
  headers JSONB DEFAULT '{}'::JSONB,
  body JSONB DEFAULT '{}'::JSONB,
  timeout_milliseconds INTEGER DEFAULT 300000
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = extensions, public
AS $$
BEGIN
  -- Chamar a função sem qualificação de schema (extensions está no search_path)
  RETURN net.http_post(
    url := url,
    headers := headers,
    body := body,
    timeout_milliseconds := timeout_milliseconds
  );
END;
$$;

-- Conceder permissões
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO anon;

-- ============================================
-- PASSO 2: Verificar se a função foi criada
-- ============================================
SELECT 
  'Função criada' as status,
  proname as function_name,
  pronamespace::regnamespace as schema
FROM pg_proc
WHERE proname = 'net_http_post'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- ============================================
-- PASSO 3: Testar a função wrapper
-- ============================================
-- Descomente para testar (opcional)
/*
SELECT public.net_http_post(
  url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
  ),
  body := jsonb_build_object('time', now()),
  timeout_milliseconds := 300000
) as request_id;
*/

-- ============================================
-- PASSO 4: Verificar se o cron job está usando a função correta
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  CASE 
    WHEN command LIKE '%public.net_http_post%' THEN '✅ Usando wrapper'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Ainda com problema'
    ELSE '⚠️ Verificar'
  END as status
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

