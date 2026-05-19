<p align="center">
  <img src="public/logo.png" alt="Illuster Coaching Classes" width="120" />
</p>

<h1 align="center">Illuster Coaching Classes</h1>

<p align="center">
  <strong>A premium, full-stack online coaching platform for JEE, NEET & Board Exam preparation</strong>
</p>

<p align="center">
  <a href="https://illuster-coaching-classes.vercel.app">🌐 Live Demo</a> &nbsp;·&nbsp;
  <a href="https://github.com/mr-vishwakarma/illuster-coaching-classes">📦 GitHub</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-BaaS-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Agora-RTC-099DFD?style=for-the-badge&logo=agora&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

---

## 📖 About

**Illuster Coaching Classes** is a production-grade ed-tech platform that digitizes an offline coaching institute into a modern, real-time web application. It serves three user roles — **Students**, **Tutors**, and **Admins** — each with dedicated dashboards, and provides features like live video classrooms, course enrollment, fee management, doubt resolution, and a beautiful public-facing marketing website.

The platform is designed with a mobile-first, responsive approach and supports both **Light** and **Dark** modes with a carefully curated design system built on CSS custom properties.

---

## ✨ Key Features

### 🏠 Public Website
- **Animated Landing Page** — GSAP & Framer Motion powered hero with typewriter effects, parallax scrolling, and smooth Lenis scroll
- **Course Catalog** — Browse all available JEE, NEET, Foundation, and Board prep courses with detailed course pages
- **3D Success Book** — Interactive page-flip component showcasing student achievements and milestones
- **Photo Gallery** — Institute gallery with lightbox viewing
- **Request Callback** — Lead capture form stored in Supabase
- **Live Traffic Badge** — Real-time visitor count using Supabase Realtime Presence
- **Custom Mouse Follower** — Ambient cursor glow effect on the landing page

### 🎓 Student Dashboard
- **Enrolled Courses** — View active courses with progress tracking
- **Live Class Access** — One-click join for ongoing live sessions with a real-time "LIVE NOW" banner
- **Doubt Portal (Questies)** — Submit doubts with image attachments; track resolution status
- **Fee Receipts** — View and download auto-generated payment receipts
- **Study Materials** — Access course-specific resources and PDFs
- **Guided Tour** — First-time onboarding walkthrough using React Joyride

### 👨‍🏫 Tutor Dashboard
- **Session Management** — Start, manage, and end live class sessions
- **Live Classroom** — Full-featured video classroom powered by Agora RTC:
  - 🎥 Camera toggle
  - 🎤 Microphone toggle
  - 🖥️ Screen sharing
  - 💬 Real-time chat sidebar (Supabase Realtime)
  - 👥 Participant list with attendance tracking
- **Student Overview** — View enrolled students and their engagement stats
- **Doubt Resolution** — Answer student doubts submitted through the Questies portal

### 🛡️ Admin Dashboard
- **Platform Analytics** — Real-time stats (total students, active courses, revenue, pending enrollments)
- **Enrollment Management** — Approve or reject student enrollment requests with drag-and-drop batch management
- **Fee Collection** — Record manual payments, generate receipt numbers, and track revenue
- **Revenue Charts** — Monthly collection trends visualized with Recharts
- **Course Management** — Create, edit, and publish/unpublish courses
- **Receipt Generation** — Printable, branded fee receipts with unique receipt numbers
- **Database Stats** — RPC-powered dashboard showing table sizes and row counts

### 🔐 Authentication & Security
- **Supabase Auth** — Email/password authentication with automatic role assignment
- **Role-Based Access Control** — Automatic dashboard routing based on `profiles.role` (student/tutor/admin)
- **Row Level Security (RLS)** — Every table is protected with granular Postgres RLS policies
- **Protected Routes** — Client-side route guards prevent unauthorized access

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 | Component-based UI with concurrent features |
| **Language** | TypeScript 6 | Type-safe development |
| **Build Tool** | Vite 8 | Lightning-fast HMR & optimized production builds |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with custom design system |
| **Routing** | React Router DOM 7 | Client-side routing with lazy loading |
| **State Management** | Zustand | Lightweight global state for auth & theme |
| **Backend (BaaS)** | Supabase | Auth, PostgreSQL database, Realtime, Edge Functions |
| **Live Video** | Agora RTC SDK | WebRTC-based live video, audio, and screen sharing |
| **Animations** | GSAP + Framer Motion | Scroll-triggered & layout animations |
| **Smooth Scroll** | Lenis | Buttery-smooth scroll experience |
| **Charts** | Recharts | Revenue analytics & data visualization |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **Notifications** | React Toastify | Toast notifications for user feedback |
| **Onboarding** | React Joyride | Guided dashboard tours for new users |
| **Drag & Drop** | dnd-kit | Sortable batch management in admin panel |
| **Sound Effects** | use-sound (Howler.js) | UI interaction sounds |
| **3D Book** | react-pageflip | Interactive page-flip component |
| **Analytics** | Vercel Speed Insights | Core Web Vitals monitoring |
| **Deployment** | Vercel | Edge-optimized hosting with CI/CD |

---

## 🏗️ Architecture

The project follows a **Feature-Driven Architecture** with clear separation of concerns:

```
src/
├── app/                          # Application shell
│   ├── App.tsx                   # Root — providers, router, global effects
│   ├── AppLayout.tsx             # Header + main + mobile nav wrapper
│   ├── PageTransition.tsx        # Route transition animations
│   ├── routes.tsx                # Centralized routing (lazy-loaded)
│   └── pages/
│       └── DashboardDispatcher   # Routes to Student/Tutor/Admin dashboard by role
│
├── features/                     # Isolated business domains
│   ├── admin/                    # Admin dashboard, receipt generation
│   │   ├── api/                  # Supabase queries (enrollments, payments)
│   │   ├── components/           # AdminStatsGrid, EnrollmentTable, FeeModal
│   │   ├── hooks/                # useAdminStats, useEnrollments
│   │   └── pages/                # AdminDashboard, ReceiptPage
│   │
│   ├── auth/                     # Login page, auth data & types
│   │   ├── components/           # LoginForm, RoleSelector
│   │   ├── context/              # (legacy — migrated to shared)
│   │   └── pages/                # LoginPage
│   │
│   ├── collaboration/            # Real-time features
│   │   ├── live-class/           # Agora-powered live classroom
│   │   │   ├── components/       # VideoArea, Controls, Sidebar, Header
│   │   │   └── pages/            # LiveClassPage
│   │   └── questies/             # Doubt portal
│   │
│   ├── student/                  # Student dashboard
│   │   ├── api/                  # Course, enrollment, fee queries
│   │   ├── components/           # CourseCard, LiveBanner, DoubtForm
│   │   ├── hooks/                # useStudentCourses, useStudentDoubts
│   │   └── pages/                # StudentDashboard
│   │
│   ├── tutor/                    # Tutor dashboard
│   │   ├── components/           # SessionCard, StudentList
│   │   └── pages/                # TutorDashboard
│   │
│   └── website/                  # Public marketing pages
│       ├── home/                 # Landing page + hero components
│       ├── about/                # About, Gallery, RequestCallback pages
│       ├── courses/              # Course catalog + detail pages
│       ├── testimonials/         # Student testimonials section
│       └── shared/               # Website-specific shared components
│
├── shared/                       # Cross-feature reusables
│   ├── components/
│   │   ├── ui/                   # StatCard, PageLoader, Skeleton, ErrorBoundary, NotFound
│   │   ├── layout/               # DashboardHeader, MobileBottomNav, PageShell, DashboardTour
│   │   ├── effects/              # MouseFollower, LiveTrafficBadge
│   │   └── logic/                # ProtectedRoute
│   ├── context/                  # AuthContext (Zustand), ThemeContext, TrafficContext
│   ├── hooks/                    # useLiveSessions, useDoubts
│   ├── lib/                      # Supabase client initialization
│   ├── styles/                   # Additional style modules
│   └── types/                    # Global TypeScript interfaces
│
├── assets/                       # Static assets (hero images, SVGs)
├── index.css                     # Global design system (CSS variables + Tailwind)
└── main.tsx                      # React DOM entry point

supabase/
├── migrations/                   # 14 incremental SQL migrations
│   ├── init_auth.sql             # profiles table + auth trigger
│   ├── phase2_tables.sql         # courses, success_diary, questies, enrollments
│   ├── phase5_live.sql           # live_messages, live_attendance + Realtime
│   ├── phase7_finance.sql        # fee_payments, enrollment status workflow
│   ├── optimization_indexes.sql  # Performance indexes
│   ├── rls_optimization.sql      # Granular RLS policies
│   └── auto_cleanup_cron.sql     # Scheduled cleanup jobs
└── functions/                    # Supabase Edge Functions
```

---

## 🗄️ Database Schema

The platform uses **Supabase (PostgreSQL)** with Row Level Security enabled on all tables:

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     profiles     │       │     courses      │       │  success_diary   │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK, FK auth) │       │ id (PK, UUID)    │       │ id (PK, UUID)    │
│ full_name        │       │ title            │       │ chapter          │
│ email            │       │ description      │       │ title            │
│ phone            │       │ category         │       │ body             │
│ address          │       │ price            │       │ tag              │
│ avatar_url       │       │ image_url        │       │ image_url        │
│ role             │       │ is_published     │       │ accent_color     │
│ updated_at       │       │ created_at       │       │ type             │
└────────┬─────────┘       └────────┬─────────┘       └──────────────────┘
         │                          │
         │    ┌─────────────────────┤
         ▼    ▼                     │
┌──────────────────┐       ┌───────┴──────────┐       ┌──────────────────┐
│course_enrollments│       │   fee_payments   │       │    questies      │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id (PK, UUID)    │──────▶│ id (PK, UUID)    │       │ id (PK, UUID)    │
│ student_id (FK)  │       │ enrollment_id(FK)│       │ student_id (FK)  │
│ course_id (FK)   │       │ amount_paid      │       │ subject          │
│ status           │       │ payment_date     │       │ question_text    │
│ enrolled_at      │       │ receipt_no       │       │ image_attachment │
└──────────────────┘       │ remarks          │       │ status           │
                           │ recorded_by (FK) │       │ tutor_id (FK)    │
                           └──────────────────┘       │ answer_text      │
                                                      └──────────────────┘
┌──────────────────┐       ┌──────────────────┐
│  live_messages   │       │ live_attendance  │
├──────────────────┤       ├──────────────────┤
│ id (PK, UUID)    │       │ id (PK, UUID)    │
│ session_id       │       │ session_id       │
│ user_id (FK)     │       │ user_id (FK)     │
│ user_name        │       │ joined_at        │
│ message          │       └──────────────────┘
│ is_teacher       │
│ created_at       │
└──────────────────┘
```

---

## ⚡ Performance Optimizations

- **Code Splitting** — All pages are lazy-loaded with `React.lazy()` + `Suspense`
- **Vendor Chunking** — Manual chunk splitting isolates heavy dependencies:
  - `vendor-agora` (~1.3 MB) — only loaded on `/live-class` routes
  - `vendor-framer-motion` (~133 KB)
  - `vendor-supabase` (~195 KB)
  - `vendor-react` (~182 KB)
- **Optimized Indexes** — Database indexes on frequently queried columns
- **RLS Optimization** — Efficient Postgres policies to minimize query overhead
- **Auto Cleanup** — Scheduled CRON jobs for stale data cleanup
- **Vercel Speed Insights** — Core Web Vitals monitoring in production

---

## 🎨 Design System

The UI is built on a token-based design system using CSS custom properties, ensuring consistent theming across Light and Dark modes:

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--bg-main` | `#FAFAF9` | `#121212` |
| `--bg-card` | `#FFFFFF` | `#1E1E1E` |
| `--text-main` | `#0F172A` | `#FFFFFF` |
| `--text-muted` | `#64748B` | `#A3A3A3` |
| `--border-light` | `#E2E8F0` | `#2A2A2A` |
| `--primary` | `#2563EB` | `#2563EB` |
| `--secondary` | `#10B981` | `#10B981` |

**Typography**: Inter (body) + Outfit (headings) via Google Fonts

**Component Library**: Reusable primitives — `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.card`, `.input-field`, `.badge`, `.glass`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Supabase](https://supabase.com) project
- An [Agora](https://www.agora.io) account (for live classes)

### 1. Clone the Repository

```bash
git clone https://github.com/mr-vishwakarma/illuster-coaching-classes.git
cd illuster-coaching-classes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Agora Configuration (for Live Classes)
VITE_AGORA_APP_ID=your_agora_app_id
```

### 4. Set Up the Database

Run the SQL migrations in your Supabase SQL Editor in order:

```
supabase/migrations/20240502_init_auth.sql          → Auth & Profiles
supabase/migrations/20240502_phase2_tables.sql       → Core tables
supabase/migrations/20240502_phase3_seed.sql         → Seed data
supabase/migrations/20240502_phase5_live.sql         → Live class tables
supabase/migrations/20240502_phase6_courses.sql      → Course enhancements
supabase/migrations/20240502_phase6_profiles.sql     → Profile extensions
supabase/migrations/20240503_phase7_finance.sql      → Fee & payment system
supabase/migrations/20240503_phase7_flexible_ids.sql → Flexible ID system
supabase/migrations/20240503_phase7_seed_courses.sql → Course seed data
supabase/migrations/20240503_phase8_profile_contacts.sql → Contact fields
supabase/migrations/20240504_auto_cleanup_cron.sql   → Scheduled cleanup
supabase/migrations/20240504_db_stats_rpc.sql        → Analytics RPCs
supabase/migrations/20240504_optimization_indexes.sql → Performance indexes
supabase/migrations/20240504_rls_optimization.sql    → RLS fine-tuning
```

### 5. Start the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
npm run preview
```

---

## 🌍 Deployment

The project is deployed on **Vercel** with automatic CI/CD from the `main` branch.

### Environment Variables on Vercel

Set the following in your Vercel project settings → Environment Variables:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `VITE_AGORA_APP_ID` | Your Agora App ID |

### SPA Routing

The `vercel.json` handles client-side routing with a catch-all rewrite:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📂 Available Scripts

| Script | Command | Description |
|---|---|---|
| **Dev Server** | `npm run dev` | Start Vite dev server with HMR |
| **Build** | `npm run build` | TypeScript check + production build |
| **Preview** | `npm run preview` | Preview production build locally |
| **Lint** | `npm run lint` | Run ESLint across the codebase |

---

## 🔗 Links

| | URL |
|---|---|
| 🌐 **Live Demo** | [illuster-coaching-classes.vercel.app](https://illuster-coaching-classes.vercel.app) |
| 📦 **GitHub Repository** | [github.com/mr-vishwakarma/illuster-coaching-classes](https://github.com/mr-vishwakarma/illuster-coaching-classes) |

---

## 👨‍💻 Author

**Mayur Vishwakarma**

- GitHub: [@mr-vishwakarma](https://github.com/mr-vishwakarma)

---

## 📄 License

This project is proprietary software built for Illuster Coaching Classes. All rights reserved.

---

<p align="center">
  Built with ❤️ for <strong>Illuster Coaching Classes</strong>
</p>
