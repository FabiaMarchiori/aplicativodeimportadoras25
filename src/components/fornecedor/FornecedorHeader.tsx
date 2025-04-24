
import { Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface FornecedorHeaderProps {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
}

export function FornecedorHeader({ fornecedor, isAdmin, onEditClick }: FornecedorHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="mb-4 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-0 top-0"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-black">{fornecedor.nome_loja || fornecedor.nome}</h1>
        <p className="text-gray-500">{fornecedor.categoria}</p>
      </div>
      
      {isAdmin && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-0 right-0 z-10 bg-white/80 hover:bg-white border-black"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </header>
  );
}
