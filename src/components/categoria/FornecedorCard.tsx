
import { Fornecedor } from "@/lib/supabase";
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
    <div className="cursor-pointer group flex flex-col items-center relative w-full">
      <FavoritoButton
        isFavorito={isFavorito(fornecedor.id)}
        onToggle={() => toggleFavorito(fornecedor.id)}
        size="sm"
        className="absolute top-1 right-1 z-10"
      />

      <div
        onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
        className="flex flex-col items-center w-full"
      >
        <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 border-3 sm:border-4 border-[#3CBBC7] overflow-hidden rounded-full mb-2 sm:mb-3 transition-transform duration-300 hover:scale-110 logo-circular-fix">
          <img
            src={fornecedor.logo_url || "/placeholder.svg"}
            alt={`Logo ${fornecedor.nome_loja || fornecedor.nome || ""}`}
            className="logo-img-fix"
          />
        </div>
        <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-center text-[#322523] mt-1 sm:mt-2 leading-tight px-1 line-clamp-2">
          {fornecedor.nome_loja || fornecedor.nome || "Sem nome"}
        </h3>
      </div>
    </div>
  );
}
