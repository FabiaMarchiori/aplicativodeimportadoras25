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
      console.log('🔒 [DEBUG] Sem usuário ou email');
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      console.log('🔍 [DEBUG] Iniciando verificação de acesso:', { 
        userId: user.id, 
        email: user.email,
        authUid: (await supabase.auth.getUser()).data.user?.id
      });

      // PRIMEIRO: Verificar se é administrador
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      console.log('👤 [DEBUG] Verificação de admin:', { 
        userId: user.id, 
        email: user.email, 
        isAdmin: profile?.is_admin,
        profileError: profileError?.message
      });

      // Se é admin, dar acesso imediato
      if (profile?.is_admin) {
        console.log('✅ [DEBUG] Admin detectado, liberando acesso');
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

      console.log('📋 [DEBUG] Busca por user_id:', { 
        userId: user.id,
        assinatura: assinaturaPorId, 
        error: errorById?.message,
        code: errorById?.code
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

      console.log('📧 [DEBUG] Busca por email:', { 
        email: user.email,
        assinatura: assinaturaPorEmail, 
        error: errorByEmail?.message,
        code: errorByEmail?.code
      });

      const assinatura = assinaturaPorId || assinaturaPorEmail;
      const assinaturaError = errorById || errorByEmail;

      if (assinatura && !assinaturaError) {
        const now = new Date();
        const expirationDate = assinatura.data_expiracao 
          ? new Date(assinatura.data_expiracao) 
          : null;

        const isActive = !expirationDate || expirationDate > now;
        
        console.log('⏰ [DEBUG] Verificação de expiração:', {
          dataExpiracao: assinatura.data_expiracao,
          agora: now.toISOString(),
          isActive,
          diasRestantes: expirationDate ? Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null
        });
        
        if (isActive) {
          console.log('✅ [DEBUG] Acesso liberado - Assinatura ativa encontrada');
          setHasAccess(true);
          setSubscription(assinatura);
          setLoading(false);
          return;
        } else {
          console.log('❌ [DEBUG] Assinatura expirada');
        }
      } else {
        console.log('❌ [DEBUG] Nenhuma assinatura ativa encontrada');
      }

      setHasAccess(false);
      setSubscription(null);
    } catch (error) {
      console.error('💥 [DEBUG] Erro ao verificar acesso:', error);
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