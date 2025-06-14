
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Session, User } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  console.log('AuthContext - Estado atual:', { user: !!user, loading, profileFetched });

  async function fetchProfile(userId: string) {
    if (profileFetched) {
      console.log('Profile já foi buscado, pulando...');
      return;
    }

    try {
      console.log('Buscando profile para usuário:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar profile:', error);
        setProfile(null);
        setIsAdmin(false);
      } else {
        console.log('Profile encontrado:', data);
        setProfile(data);
        setIsAdmin(data?.is_admin === true);
      }
      setProfileFetched(true);
    } catch (error) {
      console.error('Erro inesperado ao buscar profile:', error);
      setProfile(null);
      setIsAdmin(false);
      setProfileFetched(true);
    }
  }

  useEffect(() => {
    let mounted = true;

    // Setup auth state change listener ANTES de buscar a sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user && !profileFetched) {
        // Usar setTimeout para evitar problemas de concorrência
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id);
          }
        }, 0);
      } else if (!session?.user) {
        setProfile(null);
        setIsAdmin(false);
        setProfileFetched(false);
      }

      setLoading(false);
    });

    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Erro ao buscar sessão inicial:', error);
      }
      
      if (!mounted) return;

      console.log('Sessão inicial:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && !profileFetched) {
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id);
          }
        }, 0);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: 'disabled'
        }
      });
      return { error };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken: 'disabled',
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      return { data, error };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setProfileFetched(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signIn,
        signUp,
        signOut,
        loading,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
