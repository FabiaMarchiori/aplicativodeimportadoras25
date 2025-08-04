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

      // Verificar na tabela assinaturas (sistema atual)
      const { data: assinatura, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

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