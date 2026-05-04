-- =====================================================
-- Priority 5: Manual Disk Space Recovery (VACUUM FULL)
-- Purpose: Immediately reclaim physical disk space from deleted/updated rows.
-- Warning: This temporarily locks the tables. Best run during low-traffic hours.
-- Note: Do NOT run this as a migration. Run manually in the SQL Editor.
-- =====================================================

-- 1. Reclaim physical disk space from all tables
VACUUM FULL profiles;
VACUUM FULL courses;
VACUUM FULL course_enrollments;
VACUUM FULL fee_payments;
VACUUM FULL questies;
VACUUM FULL live_messages;
VACUUM FULL live_attendance;
VACUUM FULL success_diary;

-- 2. Update query planner statistics after vacuuming
ANALYZE;

-- =====================================================
-- Optional: Check current table sizes
-- Run this before and after to see how much space you saved!
-- =====================================================
-- SELECT 
--   relname AS table_name,
--   n_live_tup AS row_count,
--   pg_size_pretty(pg_total_relation_size(relid)) AS total_size
-- FROM pg_stat_user_tables
-- ORDER BY pg_total_relation_size(relid) DESC;
