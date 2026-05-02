-- 1. Course Enrollments Table (Manual Approval Flow)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES courses NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id)
);

-- 2. Fee Payments Table (Manual Entry by Admin)
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID REFERENCES course_enrollments ON DELETE CASCADE NOT NULL,
  amount_paid NUMERIC NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  receipt_no SERIAL,
  remarks TEXT,
  recorded_by UUID REFERENCES auth.users -- The Admin/Tutor who took the money
);

-- 3. Enable RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Enrollments
DROP POLICY IF EXISTS "Students can view their own enrollments" ON course_enrollments;
CREATE POLICY "Students can view their own enrollments" 
ON course_enrollments FOR SELECT USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can request enrollment" ON course_enrollments;
CREATE POLICY "Students can request enrollment" 
ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Admins can manage all enrollments" ON course_enrollments;
CREATE POLICY "Admins can manage all enrollments" 
ON course_enrollments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Policies for Fee Payments
DROP POLICY IF EXISTS "Students can view their own receipts" ON fee_payments;
CREATE POLICY "Students can view their own receipts" 
ON fee_payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM course_enrollments 
    WHERE id = fee_payments.enrollment_id AND student_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Only admins can record/manage payments" ON fee_payments;
CREATE POLICY "Only admins can record/manage payments" 
ON fee_payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
