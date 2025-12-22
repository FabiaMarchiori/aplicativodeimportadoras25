
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Loader2 } from 'lucide-react';
import { safeLog } from '@/utils/safeLogger';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading: authLoading, isAdmin, dataLoaded } = useAuth();
  const { hasAccess, loading: subscriptionLoading } = useSubscriptionAccess();
  const location = useLocation();

  // Considerar carregando se auth está carregando OU dados não foram carregados ainda (quando há usuário)
  const loading = authLoading || subscriptionLoading || (user && !dataLoaded);

  safeLog.debug('PrivateRoute - Estado', { 
    hasUser: !!user, 
    authLoading, 
    subscriptionLoading,
    dataLoaded,
    hasAccess,
    isAdmin,
    path: location.pathname
  });

  // Se ainda está carregando, mostrar indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1981A7] via-[#4A9DB8] to-[#5FB9C3]">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">
            {authLoading ? 'Verificando autenticação...' : 'Verificando assinatura...'}
          </p>
        </div>
      </div>
    );
  }

  // Se o usuário não está autenticado, redirecionar para a página de login
  if (!user) {
    safeLog.debug('PrivateRoute - Redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se o usuário está autenticado mas não tem acesso ativo E não é admin, redirecionar para acesso negado
  if (!hasAccess && !isAdmin) {
    safeLog.debug('PrivateRoute - Usuário sem acesso, redirecionando para acesso negado');
    return <Navigate to="/acesso-negado" replace />;
  }

  // Se o usuário está autenticado e tem acesso (ou é admin), renderizar o conteúdo
  safeLog.debug('PrivateRoute - Usuário autenticado com acesso, renderizando conteúdo');
  return <>{children}</>;
};

export default PrivateRoute;
