import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Sparkles, MessageCircle, Brain, TrendingUp, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Floating particles background component
const ParticlesBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${15 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

const benefits = [
  { icon: Brain, text: "Dúvidas sobre processos de importação", delay: "delay-200" },
  { icon: TrendingUp, text: "Estratégias de precificação e vendas", delay: "delay-300" },
  { icon: MessageCircle, text: "Marketing digital para seu negócio", delay: "delay-400" },
  { icon: PiggyBank, text: "Gestão financeira e organização", delay: "delay-500" },
];

const Mentoria = () => {
  const navigate = useNavigate();
  const { user, hasActiveSubscription, isAdmin } = useAuth();

  const handleAccessSoph = () => {
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

    navigate("/mentoria/chat");
  };

  return (
    <div className="min-h-screen bg-mentoria-gradient noise-overlay relative overflow-hidden">
      {/* Particles */}
      <ParticlesBackground />
      
      {/* Content */}
      <div className="relative z-10 container px-4 py-6 max-w-2xl mx-auto pb-24">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-white/70 hover:text-white hover:bg-white/10 animate-fade-in-up"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in-up delay-100">
          {/* Avatar with glow */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-purple-900/50 glow-purple animate-float-avatar mb-6">
            <Bot className="h-12 w-12 text-purple-300" />
          </div>
          
          {/* Title with gradient */}
          <h1 className="text-4xl font-bold text-gradient-premium mb-3">
            Mentoria com Soph
          </h1>
          
          {/* Subtitle */}
          <p className="text-purple-200/80 text-lg">
            Sua mentora de IA para empreendedoras de sucesso
          </p>
        </div>

        {/* Glass Card - What is Soph */}
        <div className="glass-card p-6 mb-6 animate-fade-in-up delay-200">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="h-6 w-6 icon-neon" />
            <h2 className="text-xl font-semibold text-white">O que é a Soph?</h2>
          </div>
          
          <p className="text-purple-200/70 mb-6 leading-relaxed">
            A Soph é uma inteligência artificial especializada em ajudar empreendedoras 
            do setor de importação. Ela pode te ajudar com:
          </p>
          
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li 
                key={index} 
                className={`flex items-start gap-3 animate-fade-in-up ${benefit.delay}`}
              >
                <div className="p-2 rounded-lg bg-purple-500/20 flex-shrink-0">
                  <benefit.icon className="h-5 w-5 icon-neon" />
                </div>
                <span className="text-purple-100/90 pt-1.5">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Glass Card CTA - Premium Access */}
        <div className="glass-card-highlight p-6 animate-fade-in-up delay-400">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Acesso Exclusivo
            </h3>
            <span className="px-3 py-1 text-xs font-medium bg-purple-500/30 text-purple-200 rounded-full border border-purple-500/30">
              Premium
            </span>
          </div>
          
          <p className="text-purple-200/60 text-sm mb-5">
            Disponível para assinantes do plano ativo
          </p>
          
          <Button 
            onClick={handleAccessSoph} 
            className="w-full btn-premium h-12 text-base rounded-xl"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Acessar Mentoria com Soph
          </Button>
          
          <p className="text-center text-purple-300/50 text-xs mt-4">
            Tire suas dúvidas 24h com inteligência artificial
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mentoria;
