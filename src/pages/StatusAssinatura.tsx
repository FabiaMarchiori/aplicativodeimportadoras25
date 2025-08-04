import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, Calendar, User, RefreshCw, ExternalLink } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const StatusAssinatura = () => {
  const { user } = useAuth();
  const { hasAccess, loading, subscription, checkAccess } = useSubscriptionAccess();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1981A7] via-[#4A9DB8] to-[#5FB9C3] p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Verificando assinatura...</span>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1981A7] via-[#4A9DB8] to-[#5FB9C3] p-4 pb-20">
      <div className="max-w-md mx-auto pt-8">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${hasAccess ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#1981A7] mb-2">
              Status da Assinatura
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Usuário</span>
              </div>
              <span className="text-sm text-gray-900">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Status</span>
              </div>
              <Badge 
                variant={hasAccess ? "default" : "destructive"}
                className={hasAccess ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {hasAccess ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>

            {subscription && (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Plano</span>
                  </div>
                  <span className="text-sm text-gray-900">{subscription.plano || 'Premium'}</span>
                </div>

                {subscription.data_expiracao && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Expira em</span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {formatDate(subscription.data_expiracao)}
                    </span>
                  </div>
                )}

                {subscription.data_inicio && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Iniciou em</span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {formatDate(subscription.data_inicio)}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="pt-4 space-y-3">
              <Button
                onClick={checkAccess}
                className="w-full bg-[#1981A7] hover:bg-[#1981A7]/90 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Status
              </Button>

              {!hasAccess && (
                <a
                  href="https://pay.kiwify.com.br/qGIyN9H"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-[#F9C820] to-[#F9C820]/90 hover:from-[#F9C820]/90 hover:to-[#F9C820]/80 text-[#1981A7] font-bold">
                    <Crown className="mr-2 h-5 w-5" />
                    Renovar Assinatura
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>

            <div className="text-xs text-gray-500 text-center pt-2">
              <p>Os dados são atualizados automaticamente via Kiwify</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default StatusAssinatura;