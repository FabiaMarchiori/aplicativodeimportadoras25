
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fornecedor } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FornecedorHeaderProps {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
}

export function FornecedorHeader({ fornecedor, isAdmin, onEditClick }: FornecedorHeaderProps) {
  return (
    <header className="mb-4">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <Avatar className="w-24 h-24 border-2 border-black">
            <AvatarImage src={fornecedor.logo_url || ''} alt={fornecedor.nome} className="object-cover" />
            <AvatarFallback>{fornecedor.nome?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-2xl font-bold text-black">{fornecedor.nome_loja || fornecedor.nome}</h1>
        <p className="text-gray-500">{fornecedor.categoria}</p>
      </div>
      
      {isAdmin && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-50 border-black"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </header>
  );
}
