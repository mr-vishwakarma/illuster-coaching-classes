import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User, UserRole } from "../../features/auth/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string, requiredRole?: UserRole) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync session from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getProfile = async (id: string, email: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        return {
          id,
          email,
          name: data.full_name || email.split('@')[0],
          role: data.role as UserRole,
          avatar: data.avatar_url || '👤',
          password: '',
          enrolledCourses: [],
          joinDate: new Date().toLocaleDateString(),
        };
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    return null;
  };

  const fetchProfile = async (id: string, email: string) => {
    const profile = await getProfile(id, email);
    if (profile) setUser(profile);
    setIsLoading(false);
  };

  const login = useCallback(async (email: string, password: string, requiredRole?: UserRole) => {
    setIsLoading(true);
    
    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      // 2. Immediately check profile for role verification
      const profile = await getProfile(data.user.id, data.user.email!);
      
      if (!profile) {
        await supabase.auth.signOut();
        setIsLoading(false);
        return { success: false, error: "Account profile not found. Please contact support." };
      }

      // 3. STRICT ROLE CHECK
      if (requiredRole && profile.role !== requiredRole) {
        await supabase.auth.signOut();
        setIsLoading(false);
        return { 
          success: false, 
          error: `Access Denied: You are registered as a ${profile.role}, but you are trying to log in to the ${requiredRole} portal.` 
        };
      }

      setUser(profile);
      setIsLoading(false);
      return { success: true, user: profile };
    }
    
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role ?? null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

