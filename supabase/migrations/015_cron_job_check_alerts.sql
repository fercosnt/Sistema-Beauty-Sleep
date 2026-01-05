-- Migration 015: Cron Job Configuration for check-alerts Edge Function
-- Schedule daily check at 8h BRT (11h UTC)

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to call check-alerts Edge Function daily at 8h BRT (11h UTC)
-- Schedule: 0 11 * * * = Every day at 11:00 UTC (8:00 BRT)
SELECT cron.schedule(
  'check-alerts-daily',
  '0 11 * * *', -- 8h BRT = 11h UTC
  $$
  SELECT
    extensions.net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/check-alerts',
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
WHERE jobname = 'check-alerts-daily';

