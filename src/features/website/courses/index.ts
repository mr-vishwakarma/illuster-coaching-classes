// ─── Courses Feature Public API ──────────────────────────────────────────────
export type { Course, Faculty, StudyMaterial } from './types';
export { courses, faculty, studyMaterials } from './data';

// Components
export { default as StickyCardStack } from './components/StickyCardStack';
export { default as CourseCardStack } from './components/CourseCardStack';
export { default as PerspectiveCarousel } from './components/PerspectiveCarousel';
