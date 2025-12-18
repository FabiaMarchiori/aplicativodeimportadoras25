import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, List, Bot } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Buscar Fornecedor",
      description: "Encontre o fornecedor ideal",
      icon: Search,
      action: () => navigate('/buscar')
    },
    {
      title: "Busca Categorias",
      description: "Encontre a Categoria ideal",
      icon: List,
      action: () => navigate('/categorias')
    },
    {
      title: "Meus Favoritos",
      description: "Seus fornecedores salvos",
      icon: Heart,
      action: () => navigate('/favoritos')
    },
    {
      title: "Mentoria Soph",
      description: "Sua assistente de IA",
      icon: Bot,
      action: () => navigate('/mentoria')
    }
  ];

  return (
    <div className="mb-6 animate-section-entry" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-2xl font-bold text-white mb-5 text-center">
        Ações Rápidas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index}
            className="cursor-pointer transition-all duration-300 overflow-hidden group card-action-premium"
            onClick={action.action}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <CardContent className="p-5 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-cyan-500/15 flex items-center justify-center group-hover:bg-cyan-500/25 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <action.icon className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-white">{action.title}</h3>
              <p className="text-xs text-white/60">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
