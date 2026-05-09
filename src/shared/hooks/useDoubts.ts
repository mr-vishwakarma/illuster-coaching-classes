import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Questie } from '../types';

export const useDoubts = (studentId?: string) => {
  const [doubts, setDoubts] = useState<Questie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDoubts = async () => {
    setIsLoading(true);
    let query = supabase
      .from('questies')
      .select('*')
      .order('created_at', { ascending: false });

    if (studentId) {
      query = query.eq('student_id', studentId);
    }

    const { data, error } = await query;
    if (!error && data) {
      setDoubts(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDoubts();

    const channel = supabase
      .channel(`questies_watch_${studentId || 'all'}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'questies' }, 
        () => fetchDoubts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  return { doubts, isLoading, refresh: fetchDoubts };
};
