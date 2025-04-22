
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/lib/supabase";

interface FornecedorHeaderProps {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
}

export function FornecedorHeader({ fornecedor, isAdmin, onEditClick }: FornecedorHeaderProps) {
  const handleOpenMap = () => {
    if (fornecedor.localizacao) {
      window.open(fornecedor.localizacao, "_blank");
    }
  };

  return (
    <header>
      <div className="flex items-center mb-4">
        <Link to={`/categoria/${fornecedor.categoria}`} className="text-primary mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold font-heading">
          Detalhes do Fornecedor
        </h1>
      </div>

      <div className="relative rounded-xl overflow-hidden shadow-lg">
        <img
          src={fornecedor.foto_destaque || "https://source.unsplash.com/random/800x400/?shop"}
          alt={fornecedor.nome_loja || fornecedor.nome}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            onClick={onEditClick}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
}
