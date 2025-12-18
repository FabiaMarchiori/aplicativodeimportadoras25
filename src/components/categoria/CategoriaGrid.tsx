
import React from 'react';
import { Categoria } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface CategoriaGridProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
}

const CategoriaGrid = ({ categorias, onEdit }: CategoriaGridProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categorias.map((categoria, index) => (
        <div 
          key={categoria.id} 
          className="relative group cursor-pointer animate-[categoryFadeIn_0.5s_ease-out_forwards] opacity-0"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div 
            onClick={() => navigate(`/categoria/${encodeURIComponent(categoria.categoria)}`)}
            className="flex flex-col items-center transition-all duration-300 ease-out hover:scale-105"
          >
            <div className="w-full aspect-square flex items-center justify-center rounded-xl bg-[#0d1f35]/80 border border-cyan-500/10 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group-hover:border-cyan-500/30">
              <img
                src={categoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
                alt={categoria.categoria}
                className="max-w-[85%] max-h-[85%] object-contain drop-shadow-lg transition-all duration-300 group-hover:brightness-110"
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-bold text-cyan-400 text-sm transition-all duration-300 group-hover:text-cyan-300">{categoria.categoria}</h3>
            </div>
          </div>
          
          {isAdmin && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-[#0a1628]/80 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(categoria);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriaGrid;
