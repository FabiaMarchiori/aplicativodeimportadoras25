
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
    <Card className="overflow-hidden card-hover border-[#3CBBC7]/20 relative h-full flex flex-col">
      <FavoritoButton
        isFavorito={isFavorito(fornecedor.id)}
        onToggle={() => toggleFavorito(fornecedor.id)}
        size="sm"
        className="absolute top-3 right-3 z-10"
      />
      
      <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-[#3CBBC7] p-1 mb-4">
          {fornecedor.logo_url ? (
            <img
              src={fornecedor.logo_url}
              alt={`Logo ${fornecedor.nome}`}
              className="w-full h-full object-contain transform scale-110"
            />
          ) : (
            <div className="text-2xl md:text-3xl font-bold text-[#3CBBC7]">
              {fornecedor.nome.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="font-semibold text-[#322523] text-base md:text-lg leading-tight">
          {fornecedor.nome}
        </h3>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          asChild 
          className="w-full hover:bg-[#FBE02F] hover:text-[#322523] text-sm"
        >
          <Link to={`/fornecedor/${fornecedor.id}`}>
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
