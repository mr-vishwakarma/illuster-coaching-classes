import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface TrafficStore {
  activeUsers: number;
  setActiveUsers: (count: number) => void;
}

export const useTraffic = create<TrafficStore>((set) => ({
  activeUsers: 1, // Start with 1 (the current user)
  setActiveUsers: (count) => set({ activeUsers: count })
}));

let channel: ReturnType<typeof supabase.channel> | null = null;

// Call this to start tracking
export const setupTrafficTracker = (userId?: string) => {
  if (channel) {
    channel.unsubscribe();
  }
  
  channel = supabase.channel('online-users', {
    config: {
      presence: {
        key: userId || 'anonymous-' + Math.random().toString(36).substr(2, 9),
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel!.presenceState();
      const count = Object.keys(state).length;
      useTraffic.getState().setActiveUsers(count);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel?.track({
          online_at: new Date().toISOString(),
        });
      }
    });
};

// We subscribe to the auth store to setup traffic tracker automatically
useAuth.subscribe((state) => {
  setupTrafficTracker(state.user?.id);
});

// Initial setup
setupTrafficTracker(useAuth.getState().user?.id);
