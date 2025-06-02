
import { Fornecedor } from "@/lib/supabase";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type FornecedorSearchCardProps = {
  fornecedor: Fornecedor;
};

export default function FornecedorSearchCard({ fornecedor }: FornecedorSearchCardProps) {
  return (
    <Card className="overflow-hidden card-hover border-[#3CBBC7]/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-[#3CBBC7] p-0.5">
            {fornecedor.logo_url ? (
              <img
                src={fornecedor.logo_url}
                alt={`Logo ${fornecedor.nome}`}
                className="w-full h-full object-contain transform scale-125"
              />
            ) : (
              <div className="text-lg font-bold text-[#3CBBC7]">
                {fornecedor.nome.charAt(0)}
              </div>
            )}
          </div>
          <h3 className="font-semibold truncate flex-1 text-[#322523]">{fornecedor.nome}</h3>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          asChild 
          className="w-full hover:bg-[#FBE02F] hover:text-[#322523]"
        >
          <Link to={`/fornecedor/${fornecedor.id}`}>
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
