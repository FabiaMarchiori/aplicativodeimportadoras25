
import { Fornecedor } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FavoritoButton } from "@/components/FavoritoButton";
import { useFavoritos } from "@/hooks/useFavoritos";

type FornecedorCardProps = {
  fornecedor: Fornecedor;
};

export default function FornecedorCard({ fornecedor }: FornecedorCardProps) {
  const navigate = useNavigate();
  const { toggleFavorito, isFavorito } = useFavoritos();
  
  return (
    <div className="cursor-pointer group flex flex-col items-center relative">
      <FavoritoButton
        isFavorito={isFavorito(fornecedor.id)}
        onToggle={() => toggleFavorito(fornecedor.id)}
        size="sm"
        className="absolute top-1 right-1 z-10"
      />
      
      <div
        onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#3CBBC7] flex items-center justify-center overflow-hidden mb-3 transition-transform duration-300 hover:scale-110 p-1">
          <img
            src={fornecedor.logo_url || "/placeholder.svg"}
            alt={`Logo ${fornecedor.nome_loja || fornecedor.nome || ""}`}
            className="w-full h-full object-contain transform scale-125"
          />
        </div>
        <h3 className="text-base font-semibold text-center text-[#322523] mt-2">
          {fornecedor.nome_loja || fornecedor.nome || "Sem nome"}
        </h3>
      </div>
    </div>
  );
}
