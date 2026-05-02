// ─── AUTH TYPES ───────────────────────────────────────────────────────────────
export type UserRole = "student" | "admin" | "tutor";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // plain for demo only
  role: UserRole;
  avatar: string;
  enrolledCourses: string[];
  joinDate: string;
  phone?: string;
}
