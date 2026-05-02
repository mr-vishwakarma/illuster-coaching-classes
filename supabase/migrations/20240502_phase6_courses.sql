-- Enable full management for admins
DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON courses;

CREATE POLICY "Everyone can view published courses" 
ON courses FOR SELECT USING (is_published = true OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'tutor'));

CREATE POLICY "Admins can manage courses" 
ON courses FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
