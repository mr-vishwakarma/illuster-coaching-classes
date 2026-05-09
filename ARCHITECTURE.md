# Illuster Project Architecture

This project follows a **Feature-Driven Architecture**, which emphasizes modularity, scalability, and clean separation of concerns.

## 📁 Directory Structure

### `src/app/`
The "brain" of the application.
- `App.tsx`: Global providers (Auth, Theme, Traffic) and high-level layout.
- `routes.tsx`: Centralized routing with code-splitting (lazy loading).
- `pages/`: Cross-feature orchestrators like `DashboardDispatcher.tsx`.

### `src/features/`
Isolated business domains. Each feature folder should ideally contain:
- `components/`: UI specific to this feature.
- `hooks/`: Domain-specific business logic.
- `pages/`: Main entry points for the feature's routes.
- `services/` or `api/`: Feature-specific API calls.

**Current Features:**
- `admin/`: Platform management and financial tools.
- `auth/`: Login and session management.
- `collaboration/`: Real-time interactions (Live Classes, Doubt Portal).
- `student/`: Student learning dashboard and course progress.
- `tutor/`: Teaching dashboard and session management.
- `website/`: Public marketing pages and landing experience.

### `src/shared/`
Reusable primitives and universal logic.
- `components/ui/`: Atomic UI components (Buttons, Inputs, Modals, StatCards).
- `components/layout/`: Global layout pieces (Header, MobileNav).
- `components/logic/`: Functional helpers (ProtectedRoute).
- `hooks/`: System-wide hooks (useLiveSessions, useDoubts).
- `context/`: Global state (Auth, Theme).
- `lib/`: Third-party initializations (Supabase).
- `types/`: Universal TypeScript interfaces.

## 🛠 Best Practices

1. **Keep Pages Lean**: Dashboards and pages should only orchestrate components and hooks. Avoid putting 500+ lines of logic in a single file.
2. **Use Shared Hooks**: If you find yourself writing the same Supabase fetch/subscribe logic in two different places, move it to `src/shared/hooks`.
3. **Prefer UI Primitives**: Use components from `shared/components/ui` for consistency. If you create a new UI pattern, move it to `shared` if it's role-agnostic.
4. **Strict Routing**: Always use the `ProtectedRoute` component in `app/routes.tsx` for any page requiring authentication.
