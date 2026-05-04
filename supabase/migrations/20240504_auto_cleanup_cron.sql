-- =====================================================
-- Priority 2: Auto-Cleanup for live_messages & live_attendance
-- Uses pg_cron (available on Supabase) to schedule automatic deletion
-- Runs every Sunday at 3:00 AM UTC
-- =====================================================

-- 1. Enable the pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Grant usage to postgres role (required on Supabase)
GRANT USAGE ON SCHEMA cron TO postgres;

-- 3. Schedule: Delete live_messages older than 30 days
-- Runs every Sunday at 03:00 UTC
SELECT cron.schedule(
  'cleanup-old-live-messages',
  '0 3 * * 0',
  $$DELETE FROM public.live_messages WHERE created_at < NOW() - INTERVAL '30 days'$$
);

-- 4. Schedule: Delete live_attendance older than 90 days
-- Runs every Sunday at 03:05 UTC
SELECT cron.schedule(
  'cleanup-old-live-attendance',
  '5 3 * * 0',
  $$DELETE FROM public.live_attendance WHERE joined_at < NOW() - INTERVAL '90 days'$$
);

-- 5. Schedule: Auto-VACUUM after cleanup to reclaim disk space
-- Runs every Sunday at 03:15 UTC (after deletions complete)
SELECT cron.schedule(
  'weekly-vacuum-analyze',
  '15 3 * * 0',
  $$VACUUM ANALYZE public.live_messages; VACUUM ANALYZE public.live_attendance$$
);

-- =====================================================
-- To verify scheduled jobs, run:
--   SELECT * FROM cron.job;
--
-- To unschedule a job:
--   SELECT cron.unschedule('cleanup-old-live-messages');
--
-- To see job run history:
--   SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
-- =====================================================
