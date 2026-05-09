// ─── COURSE TYPES ─────────────────────────────────────────────────────────────
export interface Course {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  description: string;
  duration: string;
  schedule: string;
  price: number;
  originalPrice: number;
  badge?: string;
  color: string;
  icon: string;
  syllabus: string[];
  facultyId: string;
  enrolledCount: number;
  rating: number;
  features: string[];
}

// ─── FACULTY TYPES ────────────────────────────────────────────────────────────
export interface Faculty {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  bio: string;
  avatar: string;
  achievements: string[];
  successRate: string;
  courseIds: string[];
}

// ─── STUDY MATERIAL TYPES ─────────────────────────────────────────────────────
export interface StudyMaterial {
  id: string;
  courseId: string;
  title: string;
  type: "pdf" | "video" | "test";
  duration?: string;
  size?: string;
  chapter: string;
  uploadDate: string;
  watched?: boolean;
}
