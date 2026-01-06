-- Solução Final: Atualizar Cron Job para Usar DO Block com search_path
-- 
-- PROBLEMA: PostgreSQL não permite referências cross-schema no pg_cron
-- SOLUÇÃO: Usar DO block no comando do cron para definir search_path antes de chamar a função
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- Atualizar o cron job para usar DO block
-- ============================================
DO $update_cron$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'sync-biologix-daily';
  
  IF job_id IS NOT NULL THEN
    -- Usar DO block para definir search_path e chamar a função sem qualificação
    cmd_text := 'DO $exec$ DECLARE req_id BIGINT; BEGIN SET LOCAL search_path = extensions, public; SELECT net.http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) INTO req_id; END; $exec$;';
    
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    
    RAISE NOTICE '✅ Cron job atualizado com DO block!';
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
    WHEN command LIKE '%SET LOCAL search_path%' THEN '✅ Usando DO block com search_path'
    WHEN command LIKE '%extensions.net.http_post%' THEN '❌ Ainda com problema'
    ELSE '⚠️ Verificar'
  END as status,
  LEFT(command, 200) as command_preview
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

