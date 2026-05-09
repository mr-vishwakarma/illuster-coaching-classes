// ─── UI COMPONENTS ───────────────────────────────────────────────────────────
export { default as Skeleton } from './components/ui/Skeleton';
export { default as ErrorBoundary } from './components/ui/ErrorBoundary';
export * from './components/ui/StatCard';
export * from './components/ui/SectionHeader';

// ─── EFFECTS & LOGIC ─────────────────────────────────────────────────────────
export { default as MouseFollower } from './components/effects/MouseFollower';
export { default as ProtectedRoute } from './components/logic/ProtectedRoute';

// ─── SHARED HOOKS ────────────────────────────────────────────────────────────
export * from './hooks/useLiveSessions';
export * from './hooks/useDoubts';

// ─── CORE TYPES ──────────────────────────────────────────────────────────────
export * from './types';
