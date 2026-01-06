-- Script para Corrigir a Função Wrapper (Versão 2 - SQL Dinâmico)
-- 
-- PROBLEMA: A função wrapper não pode chamar extensions.net.http_post diretamente
-- SOLUÇÃO: Usar EXECUTE com SQL dinâmico para contornar a restrição
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- PASSO 1: Recriar a função wrapper usando SQL dinâmico
-- ============================================
DROP FUNCTION IF EXISTS public.net_http_post(TEXT, JSONB, JSONB, INTEGER);

CREATE FUNCTION public.net_http_post(
  url TEXT,
  headers JSONB DEFAULT '{}'::JSONB,
  body JSONB DEFAULT '{}'::JSONB,
  timeout_milliseconds INTEGER DEFAULT 300000
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result BIGINT;
BEGIN
  -- Usar EXECUTE com SQL dinâmico para chamar a função do schema extensions
  EXECUTE format(
    'SELECT extensions.net.http_post($1, $2, $3, $4)'
  ) USING url, headers, body, timeout_milliseconds INTO result;
  
  RETURN result;
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
SELECT public.net_http_post(
  url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
  ),
  body := jsonb_build_object('time', now()),
  timeout_milliseconds := 300000
) as request_id;

