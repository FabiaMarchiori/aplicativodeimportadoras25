
import { Link } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/lib/supabase";

interface FornecedorHeaderProps {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
}

export function FornecedorHeader({ fornecedor, isAdmin, onEditClick }: FornecedorHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center mb-4">
        <Link to={`/categoria/${fornecedor.categoria_id}`} className="text-primary mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold font-heading">
          Detalhes do Fornecedor
        </h1>
      </div>

      <div className="relative rounded-xl overflow-hidden mb-6">
        <img
          src={fornecedor.foto_destaque || "https://source.unsplash.com/random/800x400/?shop"}
          alt={fornecedor.nome}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-4 w-full flex items-end">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white p-1 mr-3">
            <img
              src={fornecedor.logo_url || "https://source.unsplash.com/random/100x100/?logo"}
              alt={`Logo ${fornecedor.nome}`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h2 className="text-white text-xl sm:text-2xl font-bold">{fornecedor.nome}</h2>
        </div>
        
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
