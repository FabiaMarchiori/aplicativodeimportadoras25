
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

      console.log('🔍 [useSubscription] Iniciando busca:', { 
        userId: user.id, 
        email: user.email 
      });

      // Buscar por user_id primeiro
      const { data: subscriptionById, error: errorById } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('📋 [useSubscription] Busca por user_id:', { 
        subscription: subscriptionById, 
        error: errorById?.message 
      });

      // Fallback: Buscar por email
      const { data: subscriptionByEmail, error: errorByEmail } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('📧 [useSubscription] Busca por email:', { 
        subscription: subscriptionByEmail, 
        error: errorByEmail?.message 
      });

      const activeSubscription = subscriptionById || subscriptionByEmail;

      if (errorById && errorByEmail) {
        console.error('❌ [useSubscription] Erro ao buscar assinatura:', { errorById, errorByEmail });
        return;
      }

      setSubscription(activeSubscription);

      // Verificar se a assinatura está realmente ativa
      if (activeSubscription) {
        const now = new Date();
        const expirationDate = activeSubscription.data_expiracao 
          ? new Date(activeSubscription.data_expiracao) 
          : null;

        const isActive = !expirationDate || expirationDate > now;
        
        console.log('⏰ [useSubscription] Verificação de expiração:', {
          dataExpiracao: activeSubscription.data_expiracao,
          isActive,
          diasRestantes: expirationDate ? Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
        });

        setHasActiveSubscription(isActive);

        // Se expirou, atualizar status no banco
        if (!isActive && activeSubscription.status === 'ativa') {
          console.log('🔄 [useSubscription] Atualizando status para expirada');
          await supabase
            .from('assinaturas')
            .update({ status: 'expirada' })
            .eq('id', activeSubscription.id);
          
          setSubscription({ ...activeSubscription, status: 'expirada' });
        }
      } else {
        console.log('❌ [useSubscription] Nenhuma assinatura ativa encontrada');
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('💥 [useSubscription] Erro ao verificar assinatura:', error);
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
