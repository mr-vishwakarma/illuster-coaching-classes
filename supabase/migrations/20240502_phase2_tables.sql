-- 1. Courses Table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., 'JEE', 'NEET', 'Foundation'
  price NUMERIC,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Success Diary (3D Book Content)
CREATE TABLE success_diary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter TEXT NOT NULL, -- e.g., 'Chapter 01'
  title TEXT NOT NULL,
  body TEXT,
  tag TEXT,
  image_url TEXT,
  image_label TEXT,
  accent_color TEXT,
  order_index INTEGER DEFAULT 0,
  type TEXT CHECK (type IN ('milestone', 'topper', 'facility')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Questies (Student Doubt Portal)
CREATE TABLE questies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  question_text TEXT NOT NULL,
  image_attachment_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  tutor_id UUID REFERENCES auth.users,
  answer_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. Course Enrollments (Link students to courses)
CREATE TABLE course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES courses NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, course_id)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE questies ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- 6. Policies

-- Courses: Everyone can view published courses
CREATE POLICY "Public courses are viewable by everyone" 
  ON courses FOR SELECT USING (is_published = true);

-- Success Diary: Everyone can view achievement pages
CREATE POLICY "Success diary is viewable by everyone" 
  ON success_diary FOR SELECT USING (true);

-- Questies: Students see their own, tutors see all
CREATE POLICY "Students can view own questies" 
  ON questies FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Tutors can view all questies" 
  ON questies FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('tutor', 'admin')
    )
  );

CREATE POLICY "Students can insert questies" 
  ON questies FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Enrollments: Users view their own enrollments
CREATE POLICY "Users can view own enrollments" 
  ON course_enrollments FOR SELECT USING (auth.uid() = student_id);
