import type { User } from './types';

// ─── MOCK USERS ───────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Aarav Kapoor",
    email: "student@illuster.com",
    password: "student123",
    role: "student",
    avatar: "AK",
    enrolledCourses: ["course-jee-physics", "course-jee-maths"],
    joinDate: "2024-06-15",
    phone: "+91 98765 43210",
  },
  {
    id: "user-admin",
    name: "Admin User",
    email: "admin@illuster.com",
    password: "admin123",
    role: "admin",
    avatar: "AU",
    enrolledCourses: [],
    joinDate: "2023-01-01",
  },
  {
    id: "user-tutor",
    name: "Dr. Rajesh Sharma",
    email: "tutor@illuster.com",
    password: "tutor123",
    role: "tutor",
    avatar: "RS",
    enrolledCourses: [],
    joinDate: "2023-05-01",
  },
];
