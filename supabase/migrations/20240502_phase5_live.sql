-- 1. Live Class Messages Table
CREATE TABLE live_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL, -- e.g., 'batch-a-sys-design'
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_teacher BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE live_messages;

-- 3. Enable RLS
ALTER TABLE live_messages ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Everyone authenticated can view messages
CREATE POLICY "Authenticated users can view live messages" 
  ON live_messages FOR SELECT USING (auth.role() = 'authenticated');

-- Everyone authenticated can post messages
CREATE POLICY "Authenticated users can post live messages" 
  ON live_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Optional: Attendance Tracking Table
CREATE TABLE live_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, user_id)
);

ALTER TABLE live_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can log their own attendance" 
  ON live_attendance FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins/Tutors can view all attendance" 
  ON live_attendance FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('tutor', 'admin')
    )
  );
