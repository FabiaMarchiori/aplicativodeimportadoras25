
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/lib/supabase";
import { FavoritoButton } from "@/components/FavoritoButton";
import { useFavoritos } from "@/hooks/useFavoritos";

interface FornecedorHeaderProps {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
}

export function FornecedorHeader({ fornecedor, isAdmin, onEditClick }: FornecedorHeaderProps) {
  const { toggleFavorito, isFavorito } = useFavoritos();

  return (
    <header className="mb-4 relative w-full max-w-full">
      {/* Action buttons - top right */}
      <div className="absolute top-0 right-0 flex gap-2 z-10">
        <FavoritoButton
          isFavorito={isFavorito(fornecedor.id)}
          onToggle={() => toggleFavorito(fornecedor.id)}
          size="md"
        />
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-[#0d2847]/80 hover:bg-[#0d2847] border-[#3CBBC7]/30 hover:border-[#3CBBC7]/60 backdrop-blur-sm transition-all duration-300"
            onClick={onEditClick}
          >
            <Edit className="h-4 w-4 text-[#3CBBC7]" />
          </Button>
        )}
      </div>

      {/* Centered content */}
      <div className="flex flex-col items-center">
        {/* Logo with white ring and glow effect */}
        <div className="mb-3 group">
          <div className="relative">
            {/* Outer glow on hover */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110" />
            
            {/* Logo container */}
            <div className="relative w-36 h-36 rounded-full p-1 bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {fornecedor.logo_url ? (
                  <img 
                    src={fornecedor.logo_url} 
                    alt={fornecedor.nome} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#3CBBC7]/20 to-[#3CBBC7]/40 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#3CBBC7]">
                      {fornecedor.nome?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name and category */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2 break-words px-2">
          {fornecedor.nome_loja || fornecedor.nome}
        </h1>
        <p className="text-[#3CBBC7] text-lg font-medium">
          {fornecedor.categoria}
        </p>
      </div>
    </header>
  );
}
