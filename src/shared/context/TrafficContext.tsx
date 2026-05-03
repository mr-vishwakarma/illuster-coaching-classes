import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TrafficContextType {
  activeUsers: number;
}

const TrafficContext = createContext<TrafficContextType>({ activeUsers: 0 });

export const TrafficProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeUsers, setActiveUsers] = useState(1); // Start with 1 (the current user)
  const { user } = useAuth();

  useEffect(() => {
    // 1. Initialize the channel
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user?.id || 'anonymous-' + Math.random().toString(36).substr(2, 9),
        },
      },
    });

    // 2. Track presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // The number of unique keys in the state is the number of active users
        const count = Object.keys(state).length;
        setActiveUsers(count);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user's metadata (e.g., online status)
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  return (
    <TrafficContext.Provider value={{ activeUsers }}>
      {children}
    </TrafficContext.Provider>
  );
};

export const useTraffic = () => useContext(TrafficContext);
