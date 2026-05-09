import { useState, useMemo } from 'react';
import { courses, studyMaterials } from '../../website/courses';
import { upcomingClasses } from '../../collaboration/live-class';
import { useAuth } from '../../../shared/context/AuthContext';
import { useLiveSessions } from '../../../shared/hooks/useLiveSessions';

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use shared hook for live sessions
  const { liveSessions } = useLiveSessions();

  const enrolledCourseData = useMemo(() =>
    courses.filter((c: any) => user?.enrolledCourses?.includes(c.id)),
  [user?.enrolledCourses]);

  const myMaterials = useMemo(() =>
    studyMaterials.filter((m: any) => user?.enrolledCourses?.includes(m.courseId)),
  [user?.enrolledCourses]);

  const recentMaterials = useMemo(() => myMaterials.slice(0, 5), [myMaterials]);

  const myClasses = useMemo(() =>
    upcomingClasses.filter(c => user?.enrolledCourses?.includes(c.courseId)),
  [user?.enrolledCourses]);

  return {
    user,
    activeTab,
    setActiveTab,
    refreshTrigger,
    setRefreshTrigger,
    liveSessions,
    enrolledCourseData,
    myMaterials,
    recentMaterials,
    myClasses
  };
};
