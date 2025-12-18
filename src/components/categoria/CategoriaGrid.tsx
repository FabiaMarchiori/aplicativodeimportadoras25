
import React from 'react';
import { Categoria } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Sparkles, 
  Gem, 
  Cpu, 
  Gamepad2, 
  ShoppingBag, 
  Brush, 
  Droplet, 
  Package, 
  Backpack, 
  Smartphone, 
  PenTool, 
  Gift, 
  Scissors, 
  Home,
  type LucideIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Mapeamento de categorias para ícones Lucide
const categoryIconMap: Record<string, LucideIcon> = {
  "ACESSÓRIOS E LAÇOS": Sparkles,
  "BIJOUTERIAS E SEMIJOIAS": Gem,
  "COSMÉTICOS E PERFUMES": Droplet,
  "ELETRÔNICOS": Cpu,
  "EMBALAGENS PERSONALIZADAS": Package,
  "GAMES E ACESSÓRIOS": Gamepad2,
  "GARRAFAS E MARMITAS": ShoppingBag,
  "MAQUIAGEM": Brush,
  "MOCHILAS E MALAS": Backpack,
  "PAPELARIA FOFA": PenTool,
  "PELÍCULAS E CAPINHAS": Smartphone,
  "PERUCAS E CABELOS": Scissors,
  "PRESENTES E PELÚCIAS": Gift,
  "UNHAS E CILIOS": Sparkles,
  "UTILIDADES DOMESTICAS": Home,
};

interface CategoriaGridProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
}

const CategoriaGrid = ({ categorias, onEdit }: CategoriaGridProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const getIconForCategory = (categoryName: string): LucideIcon => {
    return categoryIconMap[categoryName] || Package;
  };
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categorias.map((categoria, index) => {
        const IconComponent = getIconForCategory(categoria.categoria);
        
        return (
          <div 
            key={categoria.id} 
            className="relative group cursor-pointer animate-[categoryFadeIn_0.5s_ease-out_forwards] opacity-0"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div 
              onClick={() => navigate(`/categoria/${encodeURIComponent(categoria.categoria)}`)}
              className="flex flex-col items-center transition-all duration-300 ease-out hover:scale-105"
            >
              {/* Anel circular com borda branca grossa */}
              <div className="w-full aspect-square flex items-center justify-center rounded-full bg-[#0a1628] border-[4px] border-white/60 transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(0,183,255,0.35)] group-hover:border-white/80">
                <IconComponent 
                  className="w-[55%] h-[55%] text-white transition-all duration-300 group-hover:text-[#5AD7FF] group-hover:drop-shadow-[0_0_8px_rgba(90,215,255,0.4)]" 
                  strokeWidth={1.5}
                />
              </div>
              <div className="p-2 text-center">
                <h3 className="font-bold text-[#9AE6FF] text-xs transition-all duration-300">{categoria.categoria}</h3>
              </div>
            </div>
            
            {isAdmin && (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 bg-[#0a1628]/90 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(categoria);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoriaGrid;
