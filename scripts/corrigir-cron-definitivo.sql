-- Script para Corrigir DEFINITIVAMENTE o Cron Job
-- 
-- PROBLEMA: Cron job ainda está usando extensions.net.http_post (comando antigo)
-- SOLUÇÃO: Atualizar para usar public.net_http_post (função wrapper)
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- PASSO 1: Garantir que a função wrapper existe
-- ============================================
CREATE OR REPLACE FUNCTION public.net_http_post(
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
  RETURN extensions.net.http_post(
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
-- PASSO 2: Atualizar o cron job para usar a função wrapper
-- ============================================
DO $update_cron$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  -- Encontrar o cron job
  SELECT jobid INTO job_id
  FROM cron.job
  WHERE jobname = 'sync-biologix-daily';
  
  IF job_id IS NOT NULL THEN
    -- Construir o comando usando public.net_http_post (função wrapper)
    cmd_text := 'SELECT public.net_http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) as request_id;';
    
    -- Atualizar o cron job
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    
    RAISE NOTICE '✅ Cron job sync-biologix-daily atualizado com sucesso!';
    RAISE NOTICE '   Agora usando: public.net_http_post (função wrapper)';
  ELSE
    RAISE WARNING '❌ Cron job sync-biologix-daily não encontrado!';
  END IF;
END;
$update_cron$;

-- ============================================
-- PASSO 3: Verificar se foi atualizado corretamente
-- ============================================
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  CASE 
    WHEN command LIKE '%public.net_http_post%' THEN '✅ CORRIGIDO - Usando wrapper'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ AINDA COM PROBLEMA - Usando comando antigo'
    ELSE '⚠️ Verificar manualmente'
  END as status,
  LEFT(command, 150) as command_preview
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- PASSO 4: Testar a função wrapper manualmente
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

