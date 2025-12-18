import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Users, Store, Star } from "lucide-react";

// Partículas sofisticadas para Hero
const HeroParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${Math.random() * 80 + 40}px`,
          height: `${Math.random() * 80 + 40}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `radial-gradient(circle, rgba(34, 211, 238, ${0.12 + Math.random() * 0.06}) 0%, transparent 70%)`,
          filter: 'blur(2px)',
          animation: `heroParticleFloat ${30 + Math.random() * 20}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    fornecedores: 0,
    categorias: 0,
    usuarios: 0,
    produtos: 0
  });

  console.log("HeroSection renderizado - user:", user);
  const firstName = user?.user_metadata?.first_name || "Visitante";

  // Animação dos contadores
  useEffect(() => {
    console.log("Iniciando animação dos contadores");
    const targetCounts = {
      fornecedores: 200,
      categorias: 15,
      usuarios: 2000,
      produtos: 1500
    };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setCounts({
        fornecedores: Math.floor(targetCounts.fornecedores * progress),
        categorias: Math.floor(targetCounts.categorias * progress),
        usuarios: Math.floor(targetCounts.usuarios * progress),
        produtos: Math.floor(targetCounts.produtos * progress)
      });
      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targetCounts);
        console.log("Animação dos contadores concluída");
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden mb-6">
      {/* Background dark premium com gradiente azul marinho → azul esverdeado */}
      <div 
        className="relative min-h-[420px] flex items-center"
        style={{
          background: `linear-gradient(135deg, #0a1628 0%, #0d2d3a 50%, #0f3443 100%)`
        }}
      >
        {/* Partículas sofisticadas */}
        <HeroParticles />
        
        <div className="container mx-auto px-6 py-10 relative z-10">
          <div className="max-w-3xl animate-hero-entry">
            {/* Saudação personalizada */}
            <div className="text-cyan-300/90 text-lg mb-2">
              Bem-vindo de volta, {firstName}! 👋
            </div>
            
            {/* Título principal com destaque ciano */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight hero-title-glow">
              Sua jornada comercial na
              <span className="block text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">25 de Março</span>
              começa aqui
            </h1>
            
            {/* Subtítulo */}
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Conecte-se aos melhores fornecedores, descubra oportunidades únicas e 
              transforme seu negócio no maior centro comercial da América Latina.
            </p>
            
            {/* CTAs principais - cores ajustadas */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button 
                onClick={() => navigate('/buscar')} 
                size="lg" 
                className="bg-cyan-500 text-white hover:bg-cyan-400 font-semibold text-lg px-8 py-4 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-[1.02]"
              >
                Explorar Fornecedores
              </Button>
              <Button 
                onClick={() => navigate('/categorias')} 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white font-semibold text-lg px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/50"
              >
                Ver Categorias
              </Button>
            </div>
            
            {/* Contadores animados - números em branco, ícones em ciano */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center animate-hero-counter" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-center mb-2">
                  <Store className="h-6 w-6 text-cyan-400 mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.fornecedores.toLocaleString()}+
                  </span>
                </div>
                <p className="text-white/70 text-sm">Fornecedores</p>
              </div>
              
              <div className="text-center animate-hero-counter" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-cyan-400 mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.categorias}+
                  </span>
                </div>
                <p className="text-white/70 text-sm">Categorias</p>
              </div>
              
              <div className="text-center animate-hero-counter" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-cyan-400 mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.usuarios.toLocaleString()}+
                  </span>
                </div>
                <p className="text-white/70 text-sm">Usuários Ativos</p>
              </div>
              
              <div className="text-center animate-hero-counter" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-cyan-400 mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.produtos.toLocaleString()}+
                  </span>
                </div>
                <p className="text-white/70 text-sm">Produtos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
