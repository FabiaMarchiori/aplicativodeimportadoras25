import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, Star, TrendingDown } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Economia de Tempo",
      description: "Encontre todos os fornecedores em um só lugar, sem precisar percorrer toda a 25 de Março",
      iconColor: "text-cyan-400"
    },
    {
      icon: Shield,
      title: "Fornecedores Verificados",
      description: "Todos os fornecedores são verificados e possuem avaliações reais de outros compradores",
      iconColor: "text-emerald-400"
    },
    {
      icon: TrendingDown,
      title: "Preços Competitivos",
      description: "Compare preços e encontre as melhores ofertas do mercado atacadista",
      iconColor: "text-[#F9C820]"
    },
    {
      icon: Star,
      title: "Avaliações Reais",
      description: "Sistema de avaliações transparente para você escolher com confiança",
      iconColor: "text-orange-400"
    }
  ];

  return (
    <div className="mb-6">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-white mb-2">
          Por que escolher nossa plataforma?
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto text-sm">
          Transformamos a experiência de compra na 25 de Março, conectando você aos melhores fornecedores de forma inteligente e eficiente.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <Card 
            key={index} 
            className="transition-all duration-300 border-0 card-dark-glass group"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                  <benefit.icon className={`h-5 w-5 ${benefit.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;
