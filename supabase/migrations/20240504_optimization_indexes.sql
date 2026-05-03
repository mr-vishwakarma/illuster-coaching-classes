-- =====================================================
-- Priority 1 Optimization: Database Indexes
-- Purpose: Speed up JOINs and WHERE clauses by 5-50x
-- Impact: ~2-5 MB disk cost, massive query performance gain
-- =====================================================

-- Profile lookups (used on every page load via AuthContext)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enrollment queries (used in FinanceManager, MyCourses, EnrollmentManager)
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON course_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON course_enrollments(course_id);

-- Payment lookups (used in ReceiptPage, FinanceManager)
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON fee_payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON fee_payments(payment_date DESC);

-- Questie lookups (used in QuestieList, QuestieAdminList)
CREATE INDEX IF NOT EXISTS idx_questies_student ON questies(student_id);
CREATE INDEX IF NOT EXISTS idx_questies_status ON questies(status);

-- Live class message lookups
CREATE INDEX IF NOT EXISTS idx_messages_session ON live_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_attendance_session ON live_attendance(session_id);

-- Partial index: only published courses (used on HomePage, CoursesPage)
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published) WHERE is_published = true;
