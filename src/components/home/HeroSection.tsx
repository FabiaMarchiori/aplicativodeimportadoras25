
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Users, Store, Star } from "lucide-react";

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

    const duration = 2000; // 2 segundos
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
    <div className="relative overflow-hidden rounded-xl mb-8">
      {/* Background com gradiente limpo (sem imagem) */}
      <div 
        className="relative bg-cover bg-center min-h-[400px] flex items-center"
        style={{
          background: `linear-gradient(135deg, rgba(95, 185, 195, 0.9) 0%, rgba(60, 187, 199, 0.8) 100%)`
        }}
      >
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl">
            {/* Saudação personalizada */}
            <div className="text-white/90 text-lg mb-2">
              Bem-vindo de volta, {firstName}! 👋
            </div>
            
            {/* Título principal */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Sua jornada comercial na
              <span className="block text-[#F9C820]">25 de Março</span>
              começa aqui
            </h1>
            
            {/* Subtítulo */}
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Conecte-se aos melhores fornecedores, descubra oportunidades únicas e 
              transforme seu negócio no maior centro comercial da América Latina.
            </p>
            
            {/* CTAs principais */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                onClick={() => navigate('/buscar')}
                size="lg"
                className="bg-[#F9C820] text-[#111827] hover:bg-[#F9C820]/90 font-semibold text-lg px-8 py-4"
              >
                Explorar Fornecedores
              </Button>
              <Button 
                onClick={() => navigate('/categorias')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-4"
              >
                Ver Categorias
              </Button>
            </div>
            
            {/* Contadores animados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Store className="h-6 w-6 text-[#F9C820] mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.fornecedores.toLocaleString()}+
                  </span>
                </div>
                <p className="text-white/80 text-sm">Fornecedores</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-[#F9C820] mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.categorias}+
                  </span>
                </div>
                <p className="text-white/80 text-sm">Categorias</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-[#F9C820] mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.usuarios.toLocaleString()}+
                  </span>
                </div>
                <p className="text-white/80 text-sm">Usuários Ativos</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-[#F9C820] mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {counts.produtos.toLocaleString()}+
                  </span>
                </div>
                <p className="text-white/80 text-sm">Produtos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
