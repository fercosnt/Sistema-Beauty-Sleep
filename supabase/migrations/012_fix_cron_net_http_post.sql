-- Migration 012: Fix Cron Job - net.http_post cross-database reference error
-- 
-- Problem: pg_cron cannot access functions in other schemas using schema-qualified names
-- Solution: Create a wrapper function in public schema that calls extensions.net.http_post
--
-- This fixes the error:
-- ERROR: cross-database references are not implemented: extensions.net.http_post

-- Create wrapper function in public schema
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO anon;

-- Update the cron job to use the wrapper function
DO $update_cron$
DECLARE
  job_id BIGINT;
  cmd_text TEXT;
BEGIN
  -- Find the cron job
  SELECT jobid INTO job_id
  FROM cron.job
  WHERE jobname = 'sync-biologix-daily';
  
  -- If the job exists, update it to use the wrapper function
  IF job_id IS NOT NULL THEN
    -- Build the command text (using variable to avoid delimiter conflicts)
    cmd_text := 'SELECT public.net_http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/sync-biologix'', headers := jsonb_build_object(''Content-Type'', ''application/json'', ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''anon_key'')), body := jsonb_build_object(''time'', now()), timeout_milliseconds := 300000) as request_id;';
    
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := cmd_text
    );
    RAISE NOTICE 'Cron job sync-biologix-daily updated successfully';
  ELSE
    RAISE WARNING 'Cron job sync-biologix-daily not found';
  END IF;
END;
$update_cron$;

-- Verify the cron job was updated
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  LEFT(command, 100) as command_preview
FROM cron.job
WHERE jobname = 'sync-biologix-daily';

