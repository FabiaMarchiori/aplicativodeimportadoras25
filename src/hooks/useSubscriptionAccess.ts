import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { safeLog } from '@/utils/safeLogger';

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
      safeLog.debug('Sem usuário ou email para verificação de acesso');
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      safeLog.debug('Iniciando verificação de acesso');

      // PRIMEIRO: Verificar se é administrador
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      safeLog.debug('Verificação de admin concluída', { 
        isAdmin: profile?.is_admin,
        hasError: !!profileError
      });

      // Se é admin, dar acesso imediato
      if (profile?.is_admin) {
        safeLog.debug('Admin detectado, liberando acesso');
        setHasAccess(true);
        setSubscription(null);
        setLoading(false);
        return;
      }

      // SEGUNDO: Verificar assinatura por user_id
      const { data: assinaturaPorId, error: errorById } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      safeLog.debug('Busca por user_id concluída', { 
        hasData: !!assinaturaPorId,
        hasError: !!errorById
      });

      // TERCEIRO: Fallback - Verificar assinatura por email
      const { data: assinaturaPorEmail, error: errorByEmail } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'ativa')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      safeLog.debug('Busca por email concluída', { 
        hasData: !!assinaturaPorEmail,
        hasError: !!errorByEmail
      });

      const assinatura = assinaturaPorId || assinaturaPorEmail;
      const assinaturaError = errorById || errorByEmail;

      if (assinatura && !assinaturaError) {
        const now = new Date();
        const expirationDate = assinatura.data_expiracao 
          ? new Date(assinatura.data_expiracao) 
          : null;

        const isActive = !expirationDate || expirationDate > now;
        
        safeLog.debug('Verificação de expiração concluída', {
          isActive,
          hasExpiration: !!expirationDate
        });
        
        if (isActive) {
          safeLog.debug('Acesso liberado - Assinatura ativa encontrada');
          setHasAccess(true);
          setSubscription(assinatura);
          setLoading(false);
          return;
        } else {
          safeLog.debug('Assinatura expirada');
        }
      } else {
        safeLog.debug('Nenhuma assinatura ativa encontrada');
      }

      setHasAccess(false);
      setSubscription(null);
    } catch (error) {
      safeLog.error('Erro ao verificar acesso', error);
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
