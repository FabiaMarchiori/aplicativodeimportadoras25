import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Sparkles, 
  Scale, 
  Palette, 
  ShoppingCart, 
  Briefcase,
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

// Dados estruturados
const oQueFaz = [
  { icon: Scale, title: "Como abrir MEI e registrar marca", desc: "Guias passo a passo para legalização" },
  { icon: Palette, title: "Criação de logomarca e domínio", desc: "Construa sua identidade profissional" },
  { icon: ShoppingCart, title: "Vendas em marketplaces", desc: "Estratégias para vender online" },
  { icon: Briefcase, title: "Gestão financeira básica", desc: "Organize as finanças do seu negócio" },
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

    // Exibe mensagem e abre Soph em nova aba (evita conflito OAuth)
    toast.info("A Mentoria Soph será aberta em uma nova aba para sua segurança.", {
      duration: 2500
    });
    
    setTimeout(() => {
      window.open("https://empreendaja-com-soph.lovable.app", "_blank", "noopener,noreferrer");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#0f3460] relative overflow-hidden">
      {/* Particles */}
      <ParticlesBackground />
      
      {/* Subtle glow effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(600px, 90vw)',
          height: '500px',
          background: 'rgba(34, 211, 238, 0.04)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container px-4 py-6 max-w-5xl mx-auto pb-24">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-white/70 hover:text-white hover:bg-white/10 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Hero Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 animate-fade-in">
          {/* Mobile: Avatar first */}
          <div className="flex justify-center lg:hidden">
            <div className="relative">
              <div 
                className="rounded-full overflow-hidden"
                style={{
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, #0a1628 0%, #0891b2 100%)',
                  padding: '3px',
                  boxShadow: '0 0 60px rgba(6, 182, 212, 0.15)',
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
                      objectPosition: 'center 20%',
                      transform: 'scale(1.15)',
                    }}
                  />
                </div>
              </div>
              
              {/* Glow sutil */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
                  transform: 'scale(1.3)',
                  zIndex: -1,
                }}
              />
            </div>
          </div>

          {/* Text Content - Left Column */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              <span className="text-cyan-400">Soph</span> — Mentoria Inteligente
            </h1>
            
            <p className="text-cyan-300/80 text-lg lg:text-xl font-medium mb-4">
              Sua parceira de negócios do EmpreendeJá
            </p>
            
            <p className="text-white/60 text-sm lg:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              A primeira agente de IA brasileira focada em educação empreendedora prática. 
              Sua assistente inteligente para decisões estratégicas e crescimento profissional do seu negócio.
            </p>
          </div>

          {/* Avatar - Right Column (Desktop only) */}
          <div className="hidden lg:flex justify-center items-center pr-8 xl:pr-12">
            <div className="relative">
              <div 
                className="rounded-full overflow-hidden"
                style={{
                  width: '280px',
                  height: '280px',
                  background: 'linear-gradient(135deg, #0a1628 0%, #0891b2 100%)',
                  padding: '4px',
                  boxShadow: '0 0 80px rgba(6, 182, 212, 0.15)',
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
                      objectPosition: 'center 20%',
                      transform: 'scale(1.15)',
                    }}
                  />
                </div>
              </div>
              
              {/* Glow sutil premium */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
                  transform: 'scale(1.4)',
                  zIndex: -1,
                }}
              />
            </div>
          </div>
        </div>

        {/* Grid de Conteúdo - 2 Colunas no Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Seção: O que é a Soph? */}
          <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 animate-fade-in h-fit">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">O que é a Soph?</h2>
            </div>
            
            <p className="text-white/60 mb-5 leading-relaxed text-sm">
              A Soph é uma agente virtual inteligente desenvolvida para orientar empreendedores 
              iniciantes e revendedores de todo o Brasil, oferecendo acesso fácil, prático e 
              gratuito a guias e materiais educativos sobre temas essenciais do mundo dos negócios.
            </p>
            
            <ul className="space-y-3">
              {oQueFaz.map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/25 transition-colors duration-300">
                    <item.icon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-white/90 font-medium text-sm block">{item.title}</span>
                    <span className="text-white/50 text-xs">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Seção: Missão, Visão e Valores */}
          <div className="bg-[#0d2847]/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 animate-fade-in h-fit">
            <h2 className="text-xl font-semibold text-white text-center mb-5">Missão, Visão e Valores</h2>
            
            <div className="space-y-4">
              {missaoVisaoValores.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-[#0a1628]/60 border border-cyan-500/10 rounded-lg p-4 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h3 className="text-cyan-400 font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed pl-[52px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Final - Full Width, Destacado */}
        <div 
          className="bg-gradient-to-br from-[#0d2847]/90 to-[#0a1628]/90 backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl p-8 animate-fade-in"
          style={{
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Pronta para acelerar seu negócio?
            </h3>
            
            <p className="text-white/60 text-sm mb-6">
              Disponível para assinantes Premium
            </p>
            
            <Button 
              onClick={handleAccessSoph} 
              className="w-full sm:w-auto sm:px-12 h-14 text-base rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-[1.02]"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Falar com a Soph
            </Button>
            
            <p className="text-white/50 text-xs mt-4">
              Tire suas dúvidas 24h com inteligência artificial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentoria;
