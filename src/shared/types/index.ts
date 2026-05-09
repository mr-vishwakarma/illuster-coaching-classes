// ─── CORE TYPES ──────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  enrolledCourses?: string[]; // IDs of courses
}

export interface LiveSession {
  id: string;
  title: string;
  batch: string;
  tutor_id: string;
  status: 'live' | 'ended' | 'scheduled';
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export interface Questie {
  id: string;
  student_id: string;
  student_name: string;
  title: string;
  description: string;
  subject: string;
  status: 'pending' | 'resolved';
  answer?: string;
  created_at: string;
  attachment_url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: number;
  duration: string;
  instructor: string;
  icon?: string;
  color?: string;
}
