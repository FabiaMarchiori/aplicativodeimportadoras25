
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute - Estado:', { user: !!user, loading, path: location.pathname });

  // Se ainda está carregando, mostrar indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F4C75] via-[#3AAFA9] to-[#5FB9C3]">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se o usuário não está autenticado, redirecionar para a página de login
  if (!user) {
    console.log('PrivateRoute - Redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se o usuário está autenticado, renderizar o conteúdo
  console.log('PrivateRoute - Usuário autenticado, renderizando conteúdo');
  return <>{children}</>;
};

export default PrivateRoute;
