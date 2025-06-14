
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Gift, Heart, List, Users, Star } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Buscar Fornecedor",
      description: "Encontre o fornecedor ideal",
      icon: Search,
      color: "from-[#5FB9C3] to-[#3CBBC7]",
      action: () => navigate('/buscar')
    },
    {
      title: "Busca Categorias",
      description: "Encontre a Categoria ideal",
      icon: List,
      color: "from-purple-500 to-purple-600",
      action: () => navigate('/categorias')
    },
    {
      title: "Meus Favoritos",
      description: "Seus fornecedores salvos",
      icon: Heart,
      color: "from-red-500 to-red-600",
      action: () => navigate('/favoritos')
    },
    {
      title: "Ir para os Bônus",
      description: "Navegue pela área de Membro",
      icon: Gift,
      color: "from-[#F9C820] to-[#E6B41D]",
      action: () => console.log("Bônus em breve")
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#111827] mb-6 text-center">
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg border-0 overflow-hidden"
            onClick={action.action}
          >
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${action.color} p-6 text-white text-center`}>
                <action.icon className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
