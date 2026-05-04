-- =====================================================
-- Priority 3 Optimization: RLS Policy Subquery Optimization
-- Purpose: Replace expensive row-level subqueries with STABLE SECURITY DEFINER functions.
-- Impact: Massive reduction in DB load for admin/tutor operations.
-- =====================================================

-- 1. Create highly optimized cached functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_tutor_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('tutor', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Update Courses Policies
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
CREATE POLICY "Admins can manage courses" ON courses FOR ALL USING (is_admin());

-- 3. Update Course Enrollments Policies
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON course_enrollments;
CREATE POLICY "Admins can manage all enrollments" ON course_enrollments FOR ALL USING (is_admin());

-- 4. Update Fee Payments Policies
DROP POLICY IF EXISTS "Only admins can record/manage payments" ON fee_payments;
CREATE POLICY "Only admins can record/manage payments" ON fee_payments FOR ALL USING (is_admin());

-- 5. Update Questies Policies
DROP POLICY IF EXISTS "Tutors can view all questies" ON questies;
CREATE POLICY "Tutors can view all questies" ON questies FOR SELECT USING (is_tutor_or_admin());

-- 6. Update Live Attendance Policies
DROP POLICY IF EXISTS "Admins/Tutors can view all attendance" ON live_attendance;
CREATE POLICY "Admins/Tutors can view all attendance" ON live_attendance FOR SELECT USING (is_tutor_or_admin());
