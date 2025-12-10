import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Sparkles, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PWAHeader } from "@/components/header/PWAHeader";

const Mentoria = () => {
  const navigate = useNavigate();
  const { user, hasActiveSubscription, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAccessSoph = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar a mentoria.");
      navigate("/login");
      return;
    }

    if (!hasActiveSubscription && !isAdmin) {
      toast.error("Você precisa de uma assinatura ativa para acessar a mentoria.");
      navigate("/acesso-negado");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-soph-token');

      if (error) {
        console.error("Error generating token:", error);
        toast.error("Erro ao acessar a mentoria. Tente novamente.");
        return;
      }

      if (data?.redirect_url) {
        window.open(data.redirect_url, '_blank');
      } else {
        toast.error("Erro ao gerar link de acesso.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Erro ao conectar com a mentoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PWAHeader />
      
      <div className="container px-4 py-6 max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mentoria com Soph
          </h1>
          <p className="text-muted-foreground">
            Sua assistente de IA para empreendedoras
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              O que é a Soph?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              A Soph é uma inteligência artificial especializada em ajudar empreendedoras 
              do setor de importação. Ela pode te ajudar com:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Dúvidas sobre processos de importação</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Estratégias de precificação e vendas</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Marketing digital para seu negócio</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Gestão financeira e organização</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Acesso Exclusivo</CardTitle>
            <CardDescription>
              Disponível para assinantes do plano ativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleAccessSoph} 
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Bot className="h-5 w-5 mr-2" />
                  Acessar Mentoria com Soph
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Mentoria;
