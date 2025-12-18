
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
    <div className="cursor-pointer group flex flex-col items-center relative w-full p-3 rounded-xl bg-[#0d1f35]/60 border border-white/10 transition-all duration-300 hover:bg-[#0d1f35]/80 hover:border-white/20 hover:shadow-[0_4px_20px_rgba(0,120,200,0.15)]">
      <FavoritoButton
        isFavorito={isFavorito(fornecedor.id)}
        onToggle={() => toggleFavorito(fornecedor.id)}
        size="sm"
        className="absolute top-2 right-2 z-10"
      />

      <div
        onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
        className="flex flex-col items-center w-full"
      >
        <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 border-[3px] sm:border-4 border-white/60 overflow-hidden rounded-full mb-2 sm:mb-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(0,120,200,0.35)] group-hover:border-white/80 logo-circular-fix">
          <img
            src={fornecedor.logo_url || "/placeholder.svg"}
            alt={`Logo ${fornecedor.nome_loja || fornecedor.nome || ""}`}
            className="logo-img-fix"
          />
        </div>
        <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-center text-[#9AE6FF] mt-1 sm:mt-2 leading-tight px-1 line-clamp-2">
          {fornecedor.nome_loja || fornecedor.nome || "Sem nome"}
        </h3>
      </div>
    </div>
  );
}
