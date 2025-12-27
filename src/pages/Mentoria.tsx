import { useState } from "react";
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
  Gem,
  KeyRound,
  Copy,
  Check,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import sophAvatar from "@/assets/soph-avatar-transparent.png";
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
  
  // Estados para o card de código de acesso
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
      window.open("https://empreendajacomsoph.netlify.app", "_blank", "noopener,noreferrer");
    }, 500);
  };

  // Gerar código de acesso
  const handleGenerateCode = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para gerar o código.");
      navigate("/login");
      return;
    }

    if (!hasActiveSubscription && !isAdmin) {
      toast.error("Você precisa de uma assinatura ativa para gerar o código.");
      navigate("/acesso-negado");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-soph-token");
      
      if (error) {
        console.error("Erro ao gerar token:", error);
        toast.error("Erro ao gerar código de acesso. Tente novamente.");
        return;
      }

      if (data?.token) {
        setAccessCode(data.token);
        toast.success("Código gerado com sucesso!");
      } else {
        toast.error("Erro ao gerar código. Resposta inválida.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar código para clipboard
  const handleCopyCode = async () => {
    if (!accessCode) return;
    
    try {
      await navigator.clipboard.writeText(accessCode);
      setIsCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar código.");
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12 animate-fade-in">
          {/* Mobile: Avatar first - Organic, no frame */}
          <div className="flex justify-center lg:hidden">
            <div className="relative">
              <img 
                src={sophAvatar}
                alt="Soph - Mentora Inteligente"
                className="w-[442px] sm:w-[520px] h-auto object-contain drop-shadow-[0_0_40px_rgba(6,182,212,0.18)]"
              />
            </div>
          </div>

          {/* Text Content - Left Column */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">
              <span className="text-cyan-400">Soph</span> — Mentoria Inteligente
            </h1>
            
            <p className="text-cyan-300/80 text-lg lg:text-xl font-medium mb-6">
              Sua parceira de negócios do EmpreendeJá
            </p>
            
            <p className="text-white/60 text-sm lg:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              A primeira agente de IA brasileira focada em educação empreendedora prática. 
              Sua assistente inteligente para decisões estratégicas e crescimento profissional do seu negócio.
            </p>
          </div>

          {/* Avatar - Right Column (Desktop only) - Organic, no frame */}
          <div className="hidden lg:flex justify-center items-start">
            <div className="relative">
              <img 
                src={sophAvatar}
                alt="Soph - Mentora Inteligente"
                className="w-[650px] xl:w-[728px] 2xl:w-[806px] h-auto object-contain drop-shadow-[0_0_60px_rgba(6,182,212,0.15)]"
              />
            </div>
          </div>
        </div>

        {/* Grid de Conteúdo - 2 Colunas no Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
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

        {/* Card de Código de Acesso Exclusivo */}
        <div className="bg-[#0f3460]/80 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Acesso exclusivo à Soph</h2>
          </div>
          
          <p className="text-white/70 mb-4 text-sm leading-relaxed">
            Como assinante do plano anual do App Importadoras, você tem acesso exclusivo à Soph.
          </p>
          
          <div className="inline-flex items-center gap-2 bg-cyan-500/15 text-cyan-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Check className="h-3.5 w-3.5" />
            Válido por 6 meses
          </div>

          {!accessCode ? (
            <Button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="w-full sm:w-auto px-8 h-12 text-sm rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-400/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 mr-2" />
                  Gerar meu código de acesso
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0a1628] border border-cyan-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-cyan-300 font-mono text-sm break-all select-all">
                    {accessCode}
                  </code>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-white/50 text-xs">
                Copie este código e use após fazer login na Soph.
              </p>
            </div>
          )}
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
