import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useLiveSessions = (tutorId?: string) => {
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      setIsLoading(true);
      let query = supabase
        .from('live_sessions')
        .select('id, title, batch, tutor_id, profiles:tutor_id(full_name)')
        .eq('status', 'live');

      if (tutorId) {
        query = query.eq('tutor_id', tutorId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error && data) {
        setLiveSessions(data);
      }
      setIsLoading(false);
    };

    fetchLiveSessions();

    const channel = supabase
      .channel(`live_sessions_watch_${tutorId || 'all'}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'live_sessions' }, 
        fetchLiveSessions
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tutorId]);

  return { liveSessions, isLoading };
};
