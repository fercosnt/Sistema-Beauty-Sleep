-- Migration 018: Automatic cleanup of resolved alerts after 3 days
-- 
-- This migration creates a function and cron job to automatically delete
-- alerts that have been resolved for more than 3 days, preventing
-- unnecessary accumulation of old resolved alerts.

-- ============================================
-- 1. Create function to delete old resolved alerts
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_resolved_alerts()
RETURNS TABLE(deleted_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count BIGINT;
BEGIN
  -- Delete alerts that were resolved more than 3 days ago
  -- Each alert has its own 3-day period starting from its resolvido_em date
  -- Example: Alert resolved on Jan 1st will be deleted on Jan 4th (3 days later)
  --          Alert resolved on Jan 5th will be deleted on Jan 8th (3 days later)
  DELETE FROM alertas
  WHERE status = 'resolvido'
    AND resolvido_em IS NOT NULL
    AND resolvido_em < NOW() - INTERVAL '3 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN QUERY SELECT deleted_count;
END;
$$;

-- ============================================
-- 2. Grant execute permission
-- ============================================
GRANT EXECUTE ON FUNCTION cleanup_resolved_alerts() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_resolved_alerts() TO service_role;

-- ============================================
-- 3. Create cron job to run cleanup daily at 2 AM UTC (11 PM BRT previous day)
-- ============================================
-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup to run daily at 2 AM UTC (11 PM BRT previous day)
-- This ensures cleanup happens during low-traffic hours
SELECT cron.schedule(
  'cleanup-resolved-alerts-daily',
  '0 2 * * *', -- Every day at 2:00 UTC (11:00 PM BRT previous day)
  $$
  SELECT cleanup_resolved_alerts();
  $$
);

-- ============================================
-- 4. Verify cron job was created
-- ============================================
SELECT 
  jobid,
  jobname,
  schedule,
  command,
  active
FROM cron.job
WHERE jobname = 'cleanup-resolved-alerts-daily';

-- ============================================
-- 5. Add comment for documentation
-- ============================================
COMMENT ON FUNCTION cleanup_resolved_alerts() IS 
  'Deletes alerts that have been resolved for more than 3 days. Each alert has its own 3-day period starting from when it was resolved. Runs daily via cron job.';

