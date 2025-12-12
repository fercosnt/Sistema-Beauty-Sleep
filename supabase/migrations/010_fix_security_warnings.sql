-- Migration 010: Fix Security Warnings
-- Moves pg_net extension from public schema to extensions schema
-- This migration addresses the "Extension in Public" security warning

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_net extension to extensions schema
-- Note: This requires dropping and recreating the extension
-- First, drop the extension from public schema
DROP EXTENSION IF EXISTS pg_net CASCADE;

-- Recreate the extension in the extensions schema
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Grant usage on the extensions schema to authenticated users
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO anon;

-- Update the cron job to use schema-qualified name for net.http_post
-- This ensures the cron job continues to work after moving the extension
DO $$
DECLARE
  job_id BIGINT;
BEGIN
  -- Find the cron job
  SELECT jobid INTO job_id
  FROM cron.job
  WHERE jobname = 'sync-biologix-daily';
  
  -- If the job exists, update it to use the schema-qualified name
  IF job_id IS NOT NULL THEN
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := $$
        SELECT
          extensions.net.http_post(
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
  END IF;
END;
$$;

-- Note: The extensions schema is typically in the search_path, so unqualified
-- references to net.http_post may still work, but using the schema-qualified
-- name (extensions.net.http_post) is more explicit and secure.


