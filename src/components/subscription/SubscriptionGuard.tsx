
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, AlertTriangle, Loader2 } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  fallback, 
  showUpgrade = true 
}) => {
  const { hasActiveSubscription, loading, subscription } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#1981A7]" />
        <span className="ml-2 text-[#1981A7]">Verificando assinatura...</span>
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1981A7] via-[#4A9DB8] to-[#5FB9C3] p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-[#F9C820] to-[#F9C820]/80 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#1981A7] mb-2">
              Acesso Premium Necessário
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">
                {subscription?.status === 'expirada' 
                  ? 'Sua assinatura expirou' 
                  : 'Você precisa de uma assinatura ativa'}
              </span>
            </div>

            <div className="text-gray-600 space-y-2">
              <p className="text-sm">
                Para acessar este conteúdo exclusivo, você precisa de uma assinatura ativa do nosso plano premium.
              </p>
              
              {subscription?.status === 'expirada' && (
                <p className="text-sm text-amber-600 font-medium">
                  Sua assinatura expirou em {' '}
                  {subscription.data_expiracao 
                    ? new Date(subscription.data_expiracao).toLocaleDateString('pt-BR')
                    : 'data não informada'
                  }
                </p>
              )}
            </div>

            <div className="pt-4">
              <a
                href="https://pay.kiwify.com.br/qGIyN9H"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-gradient-to-r from-[#F9C820] to-[#F9C820]/90 hover:from-[#F9C820]/90 hover:to-[#F9C820]/80 text-[#1981A7] font-bold py-3 text-lg">
                  <Crown className="mr-2 h-5 w-5" />
                  {subscription?.status === 'expirada' ? 'Renovar Assinatura' : 'Assinar Agora'}
                </Button>
              </a>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              <p>Plano Anual Premium - Acesso completo + bônus exclusivos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionGuard;
