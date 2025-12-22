import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Sparkles, MessageCircle, Brain, TrendingUp, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Floating particles background component - Premium cyan theme
const ParticlesBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-cyan-400/10"
        style={{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

const benefits = [
  { icon: Brain, text: "Dúvidas sobre processos de importação" },
  { icon: TrendingUp, text: "Estratégias de precificação e vendas" },
  { icon: MessageCircle, text: "Marketing digital para seu negócio" },
  { icon: PiggyBank, text: "Gestão financeira e organização" },
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#0f3460] relative overflow-hidden">
      {/* Particles */}
      <ParticlesBackground />
      
      {/* Subtle glow effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(500px, 90vw)',
          height: '400px',
          background: 'rgba(34, 211, 238, 0.04)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container px-4 py-6 max-w-2xl mx-auto pb-24">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-white/70 hover:text-white hover:bg-white/10 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in">
          {/* Avatar with cyan border */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <Bot className="h-10 w-10 text-cyan-400" />
          </div>
          
          {/* Title - clean and premium */}
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-cyan-400">Soph</span> — Mentoria Inteligente
          </h1>
          
          {/* Subtitle */}
          <p className="text-white/70 text-lg">
            Sua assistente inteligente para decisões estratégicas
          </p>
        </div>

        {/* Card - What is Soph */}
        <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-[#3CBBC7]/20 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">O que é a Soph?</h2>
          </div>
          
          <p className="text-white/60 mb-6 leading-relaxed">
            A Soph é uma inteligência artificial especializada em ajudar empreendedoras 
            do setor de importação. Ela pode te ajudar com:
          </p>
          
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-white/80 pt-1.5">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card CTA - Premium Access */}
        <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-cyan-500/25 rounded-xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              Acesso Exclusivo
            </h3>
            <span className="px-3 py-1 text-xs font-medium bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
              Premium
            </span>
          </div>
          
          <p className="text-white/60 text-sm mb-5">
            Disponível para assinantes do plano ativo
          </p>
          
          <Button 
            onClick={handleAccessSoph} 
            className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-[1.02]"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Acessar Mentoria com Soph
          </Button>
          
          <p className="text-center text-white/50 text-xs mt-4">
            Tire suas dúvidas 24h com inteligência artificial
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mentoria;
