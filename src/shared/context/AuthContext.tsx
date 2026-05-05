import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../../features/auth/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  login: (email: string, password: string, requiredRole?: UserRole) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, role: user?.role ?? null }),
  setIsLoading: (isLoading) => set({ isLoading }),
  
  login: async (email, password, requiredRole) => {
    set({ isLoading: true });
    
    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      // 2. Immediately check profile for role verification
      const profile = await getProfile(data.user.id, data.user.email!);
      
      if (!profile) {
        await supabase.auth.signOut();
        set({ isLoading: false });
        return { success: false, error: "Account profile not found. Please contact support." };
      }

      // 3. STRICT ROLE CHECK
      if (requiredRole && profile.role !== requiredRole) {
        await supabase.auth.signOut();
        set({ isLoading: false });
        return { 
          success: false, 
          error: `Access Denied: You are registered as a ${profile.role}, but you are trying to log in to the ${requiredRole} portal.` 
        };
      }

      get().setUser(profile);
      set({ isLoading: false });
      return { success: true, user: profile };
    }
    
    return { success: true };
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    get().setUser(null);
    set({ isLoading: false });
  }
}));

const getProfile = async (id: string, email: string): Promise<User | null> => {
  try {
    const cacheKey = `profile_${id}`;
    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
    
    if (cached && cacheTime && Date.now() - Number(cacheTime) < 5 * 60 * 1000) { // 5 mins
      return JSON.parse(cached);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (data) {
      const userObj: any = {
        id,
        email,
        name: data.full_name || email.split('@')[0],
        role: data.role,
        avatar: data.avatar_url || '👤',
        password: '',
        enrolledCourses: [],
        joinDate: new Date().toLocaleDateString(),
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(userObj));
      sessionStorage.setItem(`${cacheKey}_time`, String(Date.now()));
      return userObj;
    }
    return null;
  } catch (err) {
    console.error('Error fetching profile:', err);
    return null;
  }
};

// Sync session from Supabase outside React lifecycle
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    getProfile(session.user.id, session.user.email!).then(profile => {
      useAuth.getState().setUser(profile);
      useAuth.getState().setIsLoading(false);
    });
  } else {
    useAuth.getState().setIsLoading(false);
  }
});

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    getProfile(session.user.id, session.user.email!).then(profile => {
      useAuth.getState().setUser(profile);
      useAuth.getState().setIsLoading(false);
    });
  } else {
    useAuth.getState().setUser(null);
    useAuth.getState().setIsLoading(false);
  }
});

