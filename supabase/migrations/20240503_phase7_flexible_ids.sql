-- Phase 7 Refinement: Flexible IDs for Course Enrollments
-- This allows using string IDs from mock data (e.g., 'course-jee-physics')

-- 1. Drop existing tables to recreate with flexible IDs
DROP TABLE IF EXISTS fee_payments CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- 2. Courses Table (Flexible ID)
CREATE TABLE courses (
  id TEXT PRIMARY KEY, -- Changed from UUID to TEXT
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price NUMERIC,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Course Enrollments Table (Flexible ID)
CREATE TABLE course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) NOT NULL, -- Now references profiles directly
  course_id TEXT REFERENCES courses(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id)
);

-- 4. Fee Payments Table
CREATE TABLE fee_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID REFERENCES course_enrollments ON DELETE CASCADE NOT NULL,
  amount_paid NUMERIC NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  receipt_no SERIAL,
  remarks TEXT,
  recorded_by UUID REFERENCES auth.users
);

-- 5. Re-enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

-- 6. Re-apply Policies
CREATE POLICY "Public read access for courses" ON courses FOR SELECT USING (true);

CREATE POLICY "Admins can manage courses" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Students can view their own enrollments" ON course_enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can request enrollment" ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins can manage all enrollments" ON course_enrollments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Students can view their own receipts" ON fee_payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM course_enrollments WHERE id = fee_payments.enrollment_id AND student_id = auth.uid())
);
CREATE POLICY "Only admins can record/manage payments" ON fee_payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Seed with your Mock IDs so they are "Real" in the DB too
INSERT INTO courses (id, title, price, category, is_published)
VALUES 
('course-jee-physics', 'JEE Physics Pro', 24999, 'JEE', true),
('course-jee-chemistry', 'JEE Chemistry Master', 22999, 'JEE', true),
('course-jee-maths', 'JEE Mathematics Elite', 23999, 'JEE', true),
('course-neet-biology', 'NEET Biology Intensive', 19999, 'NEET', true),
('course-class10-science', 'Class 10 Science Booster', 12999, 'Foundation', true),
('course-foundation-8', 'Foundation Course (Class 8)', 8999, 'Foundation', true)
ON CONFLICT (id) DO NOTHING;
