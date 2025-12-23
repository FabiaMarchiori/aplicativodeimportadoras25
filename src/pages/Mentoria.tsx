import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  Scale, 
  Palette, 
  ShoppingCart, 
  Briefcase,
  BookOpen,
  MessageSquare,
  Bot,
  Zap,
  Target,
  Rocket,
  Gem
} from "lucide-react";
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

// Novos dados estruturados
const oQueFaz = [
  { icon: Scale, title: "Como abrir MEI e registrar marca", desc: "Guias passo a passo para legalização" },
  { icon: Palette, title: "Criação de logomarca e domínio", desc: "Construa sua identidade profissional" },
  { icon: ShoppingCart, title: "Vendas em marketplaces", desc: "Estratégias para vender online" },
  { icon: Briefcase, title: "Gestão financeira básica", desc: "Organize as finanças do seu negócio" },
];

const comoFunciona = [
  { icon: BookOpen, title: "Guias interativos", desc: "Passo a passo com botões clicáveis e links oficiais" },
  { icon: MessageSquare, title: "Linguagem simples", desc: "Explicações claras que qualquer pessoa entende" },
  { icon: Bot, title: "Chat inteligente", desc: "Tire dúvidas e receba o material certo na hora" },
  { icon: Zap, title: "Disponível 24/7", desc: "Acesse quando precisar" },
];

const missaoVisaoValores = [
  { 
    icon: Target, 
    title: "Missão", 
    desc: "Democratizar o acesso à informação empreendedora e ajudar pessoas comuns a estruturarem seus negócios de forma simples, segura e profissional." 
  },
  { 
    icon: Rocket, 
    title: "Visão", 
    desc: "Ser reconhecida como a primeira agente de IA brasileira focada em educação empreendedora prática." 
  },
  { 
    icon: Gem, 
    title: "Diferencial", 
    desc: "Um ecossistema de apoio ao microempreendedor, reunindo conhecimento, tecnologia e empatia." 
  },
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
          top: '20%',
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
          {/* Avatar da Soph - Premium 280px */}
          <div className="relative inline-block mb-5">
            <div 
              className="rounded-full overflow-hidden"
              style={{
                width: '280px',
                height: '280px',
                background: 'linear-gradient(135deg, #0a1628 0%, #0d2847 50%, #0f3460 100%)',
                padding: '4px',
                boxShadow: '0 0 50px rgba(34, 211, 238, 0.15), inset 0 0 30px rgba(34, 211, 238, 0.05)',
              }}
            >
              <div 
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #0d2847 0%, #0f3460 100%)',
                }}
              >
                <img 
                  src="/lovable-uploads/soph-avatar-oficial.png" 
                  alt="Soph - Mentora Inteligente"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center 25%',
                    transform: 'scale(1.1)',
                  }}
                />
              </div>
            </div>
            
            {/* Glow sutil atrás do avatar */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)',
                transform: 'scale(1.2)',
                zIndex: -1,
              }}
            />
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-cyan-400">Soph</span> — Mentoria Inteligente
          </h1>
          
          {/* Subtitle */}
          <p className="text-cyan-300/80 text-lg font-medium mb-3">
            Sua parceira de negócios do EmpreendeJá
          </p>
          
          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
            A primeira agente de IA brasileira focada em educação empreendedora prática. 
            Sua assistente inteligente para decisões estratégicas e crescimento profissional do seu negócio.
          </p>
        </div>

        {/* Seção: O que é a Soph? */}
        <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">O que é a Soph?</h2>
          </div>
          
          <p className="text-white/60 mb-6 leading-relaxed text-sm">
            A Soph é uma agente virtual inteligente desenvolvida para orientar empreendedores 
            iniciantes e revendedores de todo o Brasil, oferecendo acesso fácil, prático e 
            gratuito a guias e materiais educativos sobre temas essenciais do mundo dos negócios.
          </p>
          
          <ul className="space-y-4">
            {oQueFaz.map((item, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/25 transition-colors duration-300">
                  <item.icon className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="pt-0.5">
                  <span className="text-white/90 font-medium block">{item.title}</span>
                  <span className="text-white/50 text-sm">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Seção: Como a Soph Funciona */}
        <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Como a Soph Funciona</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {comoFunciona.map((item, index) => (
              <div 
                key={index} 
                className="bg-[#0a1628]/60 border border-cyan-500/10 rounded-lg p-4 hover:border-cyan-400/30 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-white/90 font-medium mb-1">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seção: Missão, Visão e Valores */}
        <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 mb-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-white text-center mb-6">Missão, Visão e Valores</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {missaoVisaoValores.map((item, index) => (
              <div 
                key={index} 
                className="bg-[#0a1628]/60 border border-cyan-500/10 rounded-lg p-4 text-center hover:border-cyan-400/30 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-cyan-400 font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-cyan-500/25 rounded-xl p-6 animate-fade-in">
          <h3 className="text-2xl font-bold text-white text-center mb-2">
            Pronta para acelerar seu negócio?
          </h3>
          
          <p className="text-white/60 text-sm text-center mb-5">
            Disponível para assinantes Premium
          </p>
          
          <Button 
            onClick={handleAccessSoph} 
            className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-[1.02]"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Falar com a Soph
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
