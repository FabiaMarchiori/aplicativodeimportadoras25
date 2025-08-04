import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Crown, ExternalLink, Home, MessageSquare } from 'lucide-react';

const AcessoNegado = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    // Garantir que o usuário seja deslogado
    signOut();
  }, [signOut]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1981A7] via-[#4A9DB8] to-[#5FB9C3] p-4">
      <div className="max-w-md mx-auto pt-20">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-[#1981A7] mb-2">
              Acesso Não Autorizado
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Você não tem permissão para acessar este conteúdo
              </span>
            </div>

            <div className="text-gray-600 space-y-2">
              <p className="text-sm">
                Para acessar o aplicativo, você precisa de uma assinatura ativa do 
                <strong> APP IMPORTADORAS DA 25 DE MARÇO</strong>.
              </p>
              
              <p className="text-sm">
                Verifique se sua compra foi confirmada ou entre em contato com o suporte.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <a
                href="https://pay.kiwify.com.br/qGIyN9H"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-gradient-to-r from-[#F9C820] to-[#F9C820]/90 hover:from-[#F9C820]/90 hover:to-[#F9C820]/80 text-[#1981A7] font-bold py-3 text-lg">
                  <Crown className="mr-2 h-5 w-5" />
                  Comprar Acesso
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full border-[#1981A7] text-[#1981A7] hover:bg-[#1981A7]/10">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Falar com Suporte
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              
              <Button
                onClick={() => navigate('/login')}
                variant="ghost"
                className="w-full text-[#1981A7] hover:bg-[#1981A7]/10"
              >
                <Home className="mr-2 h-4 w-4" />
                Voltar ao Login
              </Button>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              <p>Problemas? Entre em contato pelo WhatsApp para suporte técnico</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcessoNegado;