-- Migration 006: Cron Job Configuration for sync-biologix Edge Function
-- Schedule daily sync at 10h BRT (13h UTC)

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Store project URL and anon key in Vault for secure access
-- NOTE: Secrets must be configured using environment variables from .env.local
-- DO NOT hardcode secrets in migrations (they will be committed to Git)
-- 
-- To configure secrets, use the script that reads from .env.local:
--   npx tsx scripts/setup-cron-secrets.ts
-- 
-- Or execute SQL manually in Supabase Dashboard SQL Editor using values from .env.local:
--   SELECT vault.create_secret('NEXT_PUBLIC_SUPABASE_URL', 'project_url');
--   SELECT vault.create_secret('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon_key');
-- 
-- IMPORTANT: Replace NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
--            with actual values from your .env.local file before executing

-- Create cron job to call sync-biologix Edge Function daily at 10h BRT (13h UTC)
-- Schedule: 0 13 * * * = Every day at 13:00 UTC (10:00 BRT)
SELECT cron.schedule(
  'sync-biologix-daily',
  '0 13 * * *', -- 10h BRT = 13h UTC
  $$
  SELECT
    net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
      ),
      body := jsonb_build_object('time', now()),
      timeout_milliseconds := 300000 -- 5 minutes timeout
    ) as request_id;
  $$
);

-- Verify cron job was created
SELECT 
  jobid,
  jobname,
  schedule,
  command,
  active
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

