
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Shield, Star, TrendingDown } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Economia de Tempo",
      description: "Encontre todos os fornecedores em um só lugar, sem precisar percorrer toda a 25 de Março",
      color: "text-[#5FB9C3]",
      bgColor: "bg-[#5FB9C3]/10"
    },
    {
      icon: Shield,
      title: "Fornecedores Verificados",
      description: "Todos os fornecedores são verificados e possuem avaliações reais de outros compradores",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: TrendingDown,
      title: "Preços Competitivos",
      description: "Compare preços e encontre as melhores ofertas do mercado atacadista",
      color: "text-[#F9C820]",
      bgColor: "bg-[#F9C820]/10"
    },
    {
      icon: Star,
      title: "Avaliações Reais",
      description: "Sistema de avaliações transparente para você escolher com confiança",
      color: "text-orange-500",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#111827] mb-4">
          Por que escolher nossa plataforma?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Transformamos a experiência de compra na 25 de Março, conectando você aos melhores fornecedores de forma inteligente e eficiente.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`${benefit.bgColor} p-3 rounded-lg`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#111827] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
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
