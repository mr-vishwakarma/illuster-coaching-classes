import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import PageLoader from '../shared/components/PageLoader';
import NotFoundPage from '../shared/components/NotFoundPage';

// ─── Lazy-loaded pages (enables code-splitting) ──────────────────────────────
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const CoursesPage = lazy(() => import('../features/courses/pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('../features/courses/pages/CourseDetailPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const Dashboard = lazy(() => import('../features/dashboard/pages/Dashboard'));
const LiveClassPage = lazy(() => import('../features/live-class/pages/LiveClassPage'));
const AboutPage = lazy(() => import('../features/about/pages/AboutPage'));
const GalleryPage = lazy(() => import('../features/about/pages/GalleryPage'));
const RequestCallbackPage = lazy(() => import('../features/about/pages/RequestCallbackPage'));
const ReceiptPage = lazy(() => import('../features/dashboard/pages/ReceiptPage'));

// ─── Route definitions ──────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/request-callback" element={<RequestCallbackPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live-class"
          element={
            <ProtectedRoute>
              <LiveClassPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt/:enrollmentId"
          element={
            <ProtectedRoute>
              <ReceiptPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
