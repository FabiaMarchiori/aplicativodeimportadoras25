import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionAccess {
  hasAccess: boolean;
  loading: boolean;
  subscription: any;
  checkAccess: () => Promise<void>;
}

export const useSubscriptionAccess = (): SubscriptionAccess => {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const checkAccess = async () => {
    if (!user?.email) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // PRIMEIRO: Verificar se é administrador
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      console.log('useSubscriptionAccess - Verificação de admin:', { 
        userId: user.id, 
        email: user.email, 
        isAdmin: profile?.is_admin,
        profileError 
      });

      // Se é admin, dar acesso imediato
      if (profile?.is_admin) {
        console.log('useSubscriptionAccess - Admin detectado, liberando acesso');
        setHasAccess(true);
        setSubscription(null); // Admin não precisa de assinatura
        setLoading(false);
        return;
      }

      // SEGUNDO: Verificar assinatura apenas para usuários não-admin
      const { data: assinatura, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      console.log('useSubscriptionAccess - Verificação de assinatura:', { 
        assinatura, 
        assinaturaError 
      });

      if (assinatura && !assinaturaError) {
        // Verificar se não expirou
        const now = new Date();
        const expirationDate = assinatura.data_expiracao 
          ? new Date(assinatura.data_expiracao) 
          : null;

        const isActive = !expirationDate || expirationDate > now;
        
        if (isActive) {
          setHasAccess(true);
          setSubscription(assinatura);
          setLoading(false);
          return;
        }
      }

      setHasAccess(false);
      setSubscription(null);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setHasAccess(false);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [user]);

  return {
    hasAccess,
    loading,
    subscription,
    checkAccess
  };
};