
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/lib/supabase";

interface FornecedorHeaderProps {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
}

export function FornecedorHeader({ fornecedor, isAdmin, onEditClick }: FornecedorHeaderProps) {
  return (
    <header className="mb-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-yellow-600">{fornecedor.nome_loja || fornecedor.nome}</h1>
        <p className="text-gray-500">{fornecedor.categoria}</p>
      </div>
      
      {isAdmin && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white border-yellow-500"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </header>
  );
}
