-- Script para Debug e Correção do Cron Job
-- 
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- PASSO 1: Ver comando completo atual
-- ============================================
SELECT 
  'COMANDO ATUAL DO CRON JOB:' as info,
  command
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- PASSO 2: Análise detalhada do comando
-- ============================================
SELECT 
  'ANÁLISE:' as info,
  CASE 
    WHEN command LIKE '%net_http_post%' THEN '❌ Contém net_http_post (função wrapper)'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Contém extensions.net.http_post'
    WHEN command LIKE '%public.net_http_post%' THEN '❌ Contém public.net_http_post'
    WHEN command LIKE '%net.http_post%' AND command NOT LIKE '%net_http_post%' AND command NOT LIKE '%extensions.%' AND command NOT LIKE '%public.%' THEN '✅ Parece correto (net.http_post sem qualificação)'
    ELSE '⚠️ Padrão não reconhecido'
  END as analise
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- PASSO 3: Remover função wrapper (se existir)
-- ============================================
DROP FUNCTION IF EXISTS public.net_http_post(TEXT, JSONB, JSONB, INTEGER) CASCADE;

-- ============================================
-- PASSO 4: Recriar cron job do zero (garantir que está correto)
-- ============================================
-- Primeiro, remover o cron job atual
SELECT cron.unschedule('sync-biologix-daily');

-- Depois, criar novamente com o comando correto
SELECT cron.schedule(
  'sync-biologix-daily',
  '0 13 * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    ),
    body := jsonb_build_object('time', now()),
    timeout_milliseconds := 300000
  ) as request_id;
  $$
);

-- ============================================
-- PASSO 5: Verificar se foi criado corretamente
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  schedule,
  CASE 
    WHEN command LIKE '%net.http_post%' 
         AND command NOT LIKE '%net_http_post%' 
         AND command NOT LIKE '%extensions.%'
         AND command NOT LIKE '%public.%' THEN '✅ CORRETO'
    ELSE '❌ Ainda com problema - ver comando completo acima'
  END as status,
  LEFT(command, 200) as command_preview
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

