
import { Fornecedor } from "@/lib/supabase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FavoritoButton } from "@/components/FavoritoButton";
import { useFavoritos } from "@/hooks/useFavoritos";

type FornecedorSearchCardProps = {
  fornecedor: Fornecedor;
};

export default function FornecedorSearchCard({ fornecedor }: FornecedorSearchCardProps) {
  const { toggleFavorito, isFavorito } = useFavoritos();

  return (
    <Card className="overflow-hidden group bg-[#0D2238]/80 border-cyan-400/20 relative h-full flex flex-col transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg">
      <FavoritoButton
        isFavorito={isFavorito(fornecedor.id)}
        onToggle={() => toggleFavorito(fornecedor.id)}
        size="sm"
        className="absolute top-3 right-3 z-10"
      />

      <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
        {/* Anel externo - borda ciano */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-cyan-400 
                        transition-all duration-200 ease-out
                        group-hover:shadow-[0_0_12px_rgba(34,211,238,0.45)] mb-4">
          {/* Disco branco interno */}
          <div className="w-full h-full rounded-full bg-white overflow-hidden">
            {fornecedor.logo_url ? (
              <img
                src={fornecedor.logo_url}
                alt={`Logo ${fornecedor.nome}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#0D2238] flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-cyan-400">
                  {fornecedor.nome.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-white text-base md:text-lg leading-tight">
          {fornecedor.nome}
        </h3>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          asChild 
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-200 ease-out text-sm"
        >
          <Link to={`/fornecedor/${fornecedor.id}`}>
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
