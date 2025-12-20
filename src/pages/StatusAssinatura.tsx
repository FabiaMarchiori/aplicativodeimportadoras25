import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Crown, Calendar, User, RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const StatusAssinatura = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, loading, subscription, checkAccess } = useSubscriptionAccess();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkAccess();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061a2e] via-[#0b2a3f] to-[#0e3a52] p-4">
        <div className="max-w-md mx-auto pt-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
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
    <div className="min-h-screen bg-gradient-to-br from-[#061a2e] via-[#0b2a3f] to-[#0e3a52] p-4 pb-20 relative overflow-hidden">
      {/* Bolhas sutis de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/[0.06]"
            style={{
              width: `${80 + i * 20}px`,
              height: `${80 + i * 20}px`,
              left: `${10 + i * 12}%`,
              top: `${5 + i * 10}%`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      <div className="max-w-md mx-auto pt-6 relative z-10">
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate('/perfil')}
          className="flex items-center gap-2 text-white hover:text-cyan-400 
                     transition-colors duration-300 mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Voltar ao perfil</span>
        </button>

        <Card className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl animate-fade-in">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {/* Ícone de coroa com glow ciano */}
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/40 rounded-full blur-xl"></div>
                <div className="relative p-4 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-400/20 
                                border border-cyan-400/30">
                  <Crown className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Status da Assinatura
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Linha: Usuário */}
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-white/70">Usuário</span>
              </div>
              <span className="text-sm text-white truncate max-w-[180px]">{user?.email}</span>
            </div>

            {/* Linha: Status */}
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-white/70">Status</span>
              </div>
              <Badge 
                className={hasAccess 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"}
              >
                {hasAccess ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>

            {subscription && (
              <>
                {/* Linha: Plano */}
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white/70">Plano</span>
                  </div>
                  <span className="text-sm text-white">{subscription.plano || 'Premium'}</span>
                </div>

                {/* Linha: Expira em */}
                {subscription.data_expiracao && (
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-white/70">Expira em</span>
                    </div>
                    <span className="text-sm text-white">
                      {formatDate(subscription.data_expiracao)}
                    </span>
                  </div>
                )}

                {/* Linha: Iniciou em */}
                {subscription.data_inicio && (
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-white/70">Iniciou em</span>
                    </div>
                    <span className="text-sm text-white">
                      {formatDate(subscription.data_inicio)}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="pt-4 space-y-3">
              {/* Botão Atualizar Status - Ciano com loading */}
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 
                           text-[#061a2e] font-semibold rounded-xl
                           hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]
                           hover:scale-[1.02]
                           transition-all duration-300
                           disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Atualizando...' : 'Atualizar Status'}
              </Button>

              {/* Botão Renovar Assinatura - Amarelo */}
              {!hasAccess && (
                <a
                  href="https://pay.kiwify.com.br/qGIyN9H"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-400 
                                     text-[#061a2e] font-bold rounded-xl
                                     hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]
                                     hover:scale-[1.02]
                                     transition-all duration-300">
                    <Crown className="mr-2 h-5 w-5" />
                    Renovar Assinatura
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>

            <div className="text-xs text-white/50 text-center pt-4">
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
