
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Session, User } from '@supabase/supabase-js';
import { safeLog } from '@/utils/safeLogger';

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
  dataLoaded: boolean;
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
  const [dataLoaded, setDataLoaded] = useState(false);
  const loadingUserRef = useRef(false);

  safeLog.debug('AuthContext - Estado atual', { 
    user: !!user, 
    loading, 
    dataLoaded,
    isAdmin,
    hasActiveSubscription
  });

  async function fetchProfile(userId: string) {
    try {
      safeLog.debug('Buscando profile para usuário');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId as any)
        .maybeSingle();

      if (error) {
        safeLog.error('Erro ao buscar profile', error);
        setProfile(null);
        setIsAdmin(false);
      } else if (data) {
        safeLog.debug('Profile encontrado');
        setProfile(data as Profile);
        setIsAdmin((data as any)?.is_admin === true);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    } catch (error) {
      safeLog.error('Erro inesperado ao buscar profile', error);
      setProfile(null);
      setIsAdmin(false);
    }
  }

  async function fetchSubscription(userId: string) {
    try {
      // Obter email do usuário
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      safeLog.debug('Buscando assinatura para usuário');
      
      // Primeiro, tenta vincular assinaturas pelo e-mail
      try {
        const { data: claimedCount } = await supabase.rpc('claim_subscriptions_for_current_user');
        if (claimedCount && Number(claimedCount) > 0) {
          safeLog.debug('Assinaturas vinculadas ao usuário', { count: claimedCount });
        }
      } catch (claimError) {
        safeLog.warn('Erro ao tentar vincular assinaturas', claimError);
      }
      
      // Buscar assinatura ativa por user_id
      const { data: subscriptionsByUserId, error: errorById } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', userId as any)
        .eq('status', 'ativa' as any)
        .order('created_at', { ascending: false })
        .limit(1);

      safeLog.debug('Busca por user_id concluída', { hasData: !!subscriptionsByUserId?.length });

      // Fallback: buscar por email se não encontrou por user_id
      let subscriptionsByEmail: any[] = [];
      if ((!subscriptionsByUserId || subscriptionsByUserId.length === 0) && currentUser?.email) {
        const { data, error: errorByEmail } = await supabase
          .from('assinaturas')
          .select('*')
          .eq('email', currentUser.email as any)
          .eq('status', 'ativa' as any)
          .order('created_at', { ascending: false })
          .limit(1);
        
        subscriptionsByEmail = data || [];
        safeLog.debug('Busca por email concluída', { hasData: !!subscriptionsByEmail?.length });
      }

      const activeSubscription = subscriptionsByUserId?.[0] || subscriptionsByEmail?.[0] || null;
      
      if (activeSubscription) {
        // Verificar se não expirou
        const now = new Date();
        const expirationDate = (activeSubscription as any).data_expiracao 
          ? new Date((activeSubscription as any).data_expiracao) 
          : null;

        const isActive = !expirationDate || expirationDate > now;
        
        setSubscription(activeSubscription as Assinatura);
        setHasActiveSubscription(isActive);
        safeLog.debug('Assinatura verificada', { isActive });

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
        safeLog.debug('Nenhuma assinatura ativa encontrada');
        setSubscription(null);
        setHasActiveSubscription(false);
      }
    } catch (error) {
      safeLog.error('Erro inesperado ao buscar assinatura', error);
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
    safeLog.debug('AuthContext - Inicializando');

    const loadUserData = async (userId: string) => {
      if (loadingUserRef.current) {
        safeLog.debug('Já está carregando dados do usuário, ignorando');
        return;
      }
      
      loadingUserRef.current = true;
      safeLog.debug('Carregando dados do usuário');
      
      await Promise.all([
        fetchProfile(userId),
        fetchSubscription(userId)
      ]);
      
      if (mounted) {
        safeLog.debug('Dados carregados');
        setDataLoaded(true);
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      safeLog.debug('Auth state changed', { event, hasSession: !!session });
      
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(() => {
          if (mounted) {
            loadUserData(session.user.id);
          }
        }, 0);
      } else {
        // User logged out - reset everything
        setProfile(null);
        setIsAdmin(false);
        setSubscription(null);
        setHasActiveSubscription(false);
        setDataLoaded(false);
        loadingUserRef.current = false;
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        safeLog.error('Erro ao buscar sessão inicial', error);
        if (mounted) setLoading(false);
        return;
      }
      
      if (!mounted) return;

      safeLog.debug('Sessão inicial', { hasSession: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          if (mounted) {
            loadUserData(session.user.id);
          }
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      safeLog.debug('Tentando fazer login');
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      safeLog.debug('Resposta do login', { success: !error });
      return { error };
    } catch (error) {
      safeLog.error('Erro durante sign in', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      safeLog.debug('Tentando registrar usuário');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      safeLog.debug('Resposta do registro', { success: !error });
      return { data, error };
    } catch (error) {
      safeLog.error('Erro durante sign up', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    safeLog.debug('Fazendo logout');
    loadingUserRef.current = false;
    setDataLoaded(false);
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
        dataLoaded,
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
