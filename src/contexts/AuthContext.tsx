
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Session, User } from '@supabase/supabase-js';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Assinatura = Database['public']['Tables']['assinaturas']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  subscription: Assinatura | null;
  hasActiveSubscription: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Assinatura | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  console.log('AuthContext - Estado atual:', { 
    user: !!user, 
    loading, 
    profileFetched, 
    hasActiveSubscription,
    currentUrl: window.location.href 
  });

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
        .eq('id', userId as any)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar profile:', error);
        setProfile(null);
        setIsAdmin(false);
      } else if (data) {
        console.log('Profile encontrado:', data);
        setProfile(data as Profile);
        setIsAdmin((data as any)?.is_admin === true);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setProfileFetched(true);
    } catch (error) {
      console.error('Erro inesperado ao buscar profile:', error);
      setProfile(null);
      setIsAdmin(false);
      setProfileFetched(true);
    }
  }

  async function fetchSubscription(userId: string) {
    try {
      console.log('Buscando assinatura para usuário:', userId);
      
      // Primeiro, tenta vincular assinaturas pelo e-mail
      try {
        const { data: claimedCount } = await supabase.rpc('claim_subscriptions_for_current_user');
        if (claimedCount && Number(claimedCount) > 0) {
          console.log(`${claimedCount} assinatura(s) vinculada(s) ao usuário pelo e-mail`);
        }
      } catch (claimError) {
        console.warn('Erro ao tentar vincular assinaturas:', claimError);
      }
      
      // Buscar assinatura ativa do usuário
      const { data: subscriptions, error } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', userId as any)
        .eq('status', 'ativa' as any)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erro ao buscar assinatura:', error);
        setSubscription(null);
        setHasActiveSubscription(false);
        return;
      }

      const activeSubscription = subscriptions?.[0] || null;
      console.log('Assinatura encontrada:', activeSubscription);
      
      if (activeSubscription) {
        // Verificar se não expirou
        const now = new Date();
        const expirationDate = (activeSubscription as any).data_expiracao 
          ? new Date((activeSubscription as any).data_expiracao) 
          : null;

        const isActive = !expirationDate || expirationDate > now;
        
        setSubscription(activeSubscription as Assinatura);
        setHasActiveSubscription(isActive);

        // Se expirou, atualizar status no banco
        if (!isActive && (activeSubscription as any).status === 'ativa') {
          await supabase
            .from('assinaturas')
            .update({ status: 'expirada' } as any)
            .eq('id', (activeSubscription as any).id as any);
          
          setSubscription({ ...activeSubscription, status: 'expirada' } as Assinatura);
          setHasActiveSubscription(false);
        }
      } else {
        setSubscription(null);
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Erro inesperado ao buscar assinatura:', error);
      setSubscription(null);
      setHasActiveSubscription(false);
    }
  }

  const refreshSubscription = async () => {
    if (user) {
      await fetchSubscription(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('AuthContext - Inicializando...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session, 'URL:', window.location.href);
      
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user && !profileFetched) {
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id);
            fetchSubscription(session.user.id);
          }
        }, 0);
      } else if (!session?.user) {
        setProfile(null);
        setIsAdmin(false);
        setSubscription(null);
        setHasActiveSubscription(false);
        setProfileFetched(false);
      }

      setLoading(false);
    });

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
            fetchSubscription(session.user.id);
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
      console.log('Tentando fazer login com Supabase...');
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Resposta do login:', { error, data: !!data });
      return { error };
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Tentando registrar usuário...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      console.log('Resposta do registro:', { error, data: !!data });
      return { data, error };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log('Fazendo logout...');
    setProfileFetched(false);
    setSubscription(null);
    setHasActiveSubscription(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        subscription,
        hasActiveSubscription,
        signIn,
        signUp,
        signOut,
        loading,
        isAdmin,
        refreshSubscription,
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
