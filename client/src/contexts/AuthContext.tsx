import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSupabase, type AuthUser, getCurrentUser, signInWithGoogle, signOut, isSupabaseConfigured, initSupabase } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    // Initialize Supabase config from server
    initSupabase().then(() => {
      setConfigured(isSupabaseConfigured());
      
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      // Get initial session
      getCurrentUser().then(setUser).finally(() => setLoading(false));

      // Listen for auth changes
      const client = getSupabase();
      if (!client) return;

      const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const authUser = await getCurrentUser();
          setUser(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    });
  }, []);

  const signIn = async () => {
    if (!configured) {
      console.warn('Supabase not configured');
      return;
    }
    await signInWithGoogle();
  };

  const logOut = async () => {
    if (!configured) return;
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured: configured, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
