# Illuster — Phase 5 & 6 Roadmap

### 🟡 Phase 5: Student Engagement (Current focus)
1. **Interactive Study Materials**: Instead of just buttons, create a modal or page to watch videos and view PDFs directly in-app.
2. **Real Schedule/Calendar**: Replace the "Schedule" placeholder with a real weekly timetable fetched from Supabase.
3. **Doubt Portal (Student side)**: Implement the "Ask a Doubt" form that actually uploads to the `questies` table.

### 🟡 Phase 6: Admin Power-Tools
1. **Batch Management**: Allow admins to create new batches and drag-and-drop students into them.
2. **Revenue Analytics**: Improve the "Finance" tab with a real chart showing monthly collection trends.
3. **Live Class Recording**: (Optional/Advanced) Add a button for tutors to record sessions to the cloud.

### 🟢 Phase 7: Polish & SEO
1. **Custom Metadata**: Dynamic meta tags for Course pages to improve Google ranking.
2. **Loading States**: Add premium skeleton loaders for all dashboard tabs.
3. **Global Search**: Command palette (Ctrl+K) to quickly jump to any course, student, or doubt.

We will implement this later rememeber"
My Analysis & Suggestion for the Login Flow:
Currently, your LoginPage.tsx has a toggle where the user selects their role (Student, Tutor, Admin) before clicking "Sign In". In AuthContext.tsx, you have a "strict role check" that blocks the user if they select the wrong role (e.g., if a student accidentally selects "Tutor", the app shows an "Access Denied" error).

Suggestion: Since their role is securely determined by Supabase (via the profiles table) immediately after they log in with their email and password, you don't actually need to ask them for their role on the login screen. We could completely remove the Student | Tutor | Admin toggle buttons from the UI. They just enter their email and password, and the system automatically logs them in and routes them to their correct dashboard based on their true Supabase role. This makes the login page much cleaner and prevents any accidental "Access Denied" errors from mis-clicks.
"
