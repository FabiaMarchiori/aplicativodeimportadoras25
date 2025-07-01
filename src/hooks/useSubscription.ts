
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Assinatura = Database['public']['Tables']['assinaturas']['Row'];

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Assinatura | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setHasActiveSubscription(false);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Buscar assinatura ativa do usuário
      const { data: subscriptions, error } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erro ao buscar assinatura:', error);
        return;
      }

      const activeSubscription = subscriptions?.[0] || null;
      setSubscription(activeSubscription);

      // Verificar se a assinatura está realmente ativa
      if (activeSubscription) {
        const now = new Date();
        const expirationDate = activeSubscription.data_expiracao 
          ? new Date(activeSubscription.data_expiracao) 
          : null;

        const isActive = !expirationDate || expirationDate > now;
        setHasActiveSubscription(isActive);

        // Se expirou, atualizar status no banco
        if (!isActive && activeSubscription.status === 'ativa') {
          await supabase
            .from('assinaturas')
            .update({ status: 'expirada' })
            .eq('id', activeSubscription.id);
          
          setSubscription({ ...activeSubscription, status: 'expirada' });
        }
      } else {
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      setHasActiveSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    fetchSubscription();
  };

  return {
    subscription,
    hasActiveSubscription,
    loading,
    refreshSubscription
  };
};
