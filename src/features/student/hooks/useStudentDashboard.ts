import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../../src/shared/lib/supabase';
import { courses, studyMaterials } from '../../../features/courses';
import { upcomingClasses } from '../../../features/live-class';
import { useAuth } from '../../../shared/context/AuthContext';

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

  // Real-time live sessions listener
  useEffect(() => {
    const fetchLiveSessions = async () => {
      const { data } = await supabase
        .from('live_sessions')
        .select('id, title, batch, tutor_id, profiles:tutor_id(full_name)')
        .eq('status', 'live');
      if (data) setLiveSessions(data);
    };

    fetchLiveSessions();

    const channel = supabase
      .channel('student_live_sessions_watch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, fetchLiveSessions)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const enrolledCourseData = useMemo(() =>
    courses.filter(c => user?.enrolledCourses?.includes(c.id)),
  [user?.enrolledCourses]);

  const myMaterials = useMemo(() =>
    studyMaterials.filter(m => user?.enrolledCourses?.includes(m.courseId)),
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
