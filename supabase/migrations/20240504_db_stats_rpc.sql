-- =====================================================
-- Priority 6: Admin Database Health Dashboard RPC
-- Purpose: Exposes database statistics (table sizes, row counts) securely
-- to the frontend so admins can monitor Free Tier limits.
-- =====================================================

CREATE OR REPLACE FUNCTION get_db_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- Only allow admins to execute this (extra safety beyond UI hiding)
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT json_agg(row_to_json(t)) INTO result
  FROM (
    SELECT 
      relname AS table_name,
      n_live_tup AS row_count,
      pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
      pg_total_relation_size(relid) AS bytes
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(relid) DESC
  ) t;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
