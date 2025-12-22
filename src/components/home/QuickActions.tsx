import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShieldCheck, Sparkles, Lock } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Categorias em Alta",
      description: "Descubra as mais procuradas",
      icon: TrendingUp,
    },
    {
      title: "Fornecedores Verificados",
      description: "Qualidade garantida",
      icon: ShieldCheck,
    },
    {
      title: "Novidades da Semana",
      description: "Últimas adições",
      icon: Sparkles,
    },
    {
      title: "Dicas de Segurança",
      description: "Compre com confiança",
      icon: Lock,
    }
  ];

  return (
    <div className="mb-6 animate-section-entry" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-2xl font-bold text-white mb-5 text-center">
        Destaques
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index}
            className="overflow-hidden group bg-[#0a1628]/80 border border-white/10 
                       hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
                       hover:-translate-y-1 transition-all duration-300"
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
