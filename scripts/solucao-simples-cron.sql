-- Solução Simples: Atualizar Cron Job para Usar net.http_post sem Qualificação
-- 
-- PROBLEMA: PostgreSQL não permite referências cross-schema no pg_cron
-- SOLUÇÃO: Usar net.http_post sem qualificação (o search_path do banco inclui extensions)
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- Atualizar o cron job para usar net.http_post sem qualificação
-- ============================================
DO $update_cron$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'sync-biologix-daily';
  
  IF job_id IS NOT NULL THEN
    -- Usar net.http_post sem qualificação de schema
    -- O search_path do banco deve incluir extensions
    cmd_text := 'SELECT net.http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) as request_id;';
    
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    
    RAISE NOTICE '✅ Cron job atualizado para usar net.http_post sem qualificação!';
  END IF;
END;
$update_cron$;

-- ============================================
-- Verificar se foi atualizado
-- ============================================
SELECT 
  jobid,
  jobname,
  active,
  CASE 
    WHEN command LIKE '%net.http_post%' AND command NOT LIKE '%extensions.%' THEN '✅ Usando sem qualificação'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Ainda com problema'
    ELSE '⚠️ Verificar'
  END as status,
  LEFT(command, 200) as command_preview
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

-- ============================================
-- Testar se funciona (opcional)
-- ============================================
-- Execute este comando para testar se net.http_post funciona sem qualificação:
-- SELECT net.http_post(
--   url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
--   headers := jsonb_build_object(
--     'Content-Type', 'application/json',
--     'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
--   ),
--   body := jsonb_build_object('time', now()),
--   timeout_milliseconds := 300000
-- ) as request_id;

