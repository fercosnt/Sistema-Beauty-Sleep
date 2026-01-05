-- Script para Verificar o Comando Atual do Cron Job
-- 
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- Ver comando completo do cron job
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  schedule,
  command,
  LENGTH(command) as command_length
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- Verificar se contém palavras-chave problemáticas
-- ============================================
SELECT 
  jobid,
  jobname,
  CASE 
    WHEN command LIKE '%net_http_post%' THEN '❌ Usando função wrapper net_http_post'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Usando extensions.net.http_post'
    WHEN command LIKE '%net.http_post%' AND command NOT LIKE '%net_http_post%' AND command NOT LIKE '%extensions.%' THEN '✅ Usando net.http_post diretamente'
    ELSE '⚠️ Padrão não reconhecido'
  END as analise,
  CASE 
    WHEN command LIKE '%public.net_http_post%' THEN '❌ Chamando função wrapper public.net_http_post'
    ELSE 'OK'
  END as verifica_wrapper
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

