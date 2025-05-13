
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
      {categorias.map((categoria) => (
        <div 
          key={categoria.id} 
          className="relative group cursor-pointer hover:scale-105 transition-transform"
        >
          <div 
            onClick={() => navigate(`/categoria/${encodeURIComponent(categoria.categoria)}`)}
            className="flex flex-col items-center"
          >
            <div className="w-full aspect-square flex items-center justify-center">
              <img
                src={categoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
                alt={categoria.categoria}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-2 text-center">
              <h3 className="font-bold text-[#3CBBC7]">{categoria.categoria}</h3>
            </div>
          </div>
          
          {isAdmin && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
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
