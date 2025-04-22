
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, MapPin } from "lucide-react";
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
    <header className="mb-6">
      <div className="flex items-center mb-4">
        <Link to={`/categoria/${fornecedor.categoria}`} className="text-primary mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold font-heading">
          Detalhes do Fornecedor
        </h1>
      </div>

      <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg">
        <img
          src={fornecedor.foto_destaque || "https://source.unsplash.com/random/800x400/?shop"}
          alt={fornecedor.nome_loja || fornecedor.nome}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-4 w-full flex items-end">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white p-1 mr-3 shadow-md">
            <img
              src={fornecedor.logo_url || "https://source.unsplash.com/random/100x100/?logo"}
              alt={`Logo ${fornecedor.nome_loja || fornecedor.nome}`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl sm:text-2xl font-bold truncate">{fornecedor.nome_loja || fornecedor.nome}</h2>
            {fornecedor.Endereco && (
              <div 
                className="flex items-center text-white/90 text-sm cursor-pointer hover:underline mt-1"
                onClick={handleOpenMap}
              >
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{fornecedor.Endereco}</span>
              </div>
            )}
          </div>
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
