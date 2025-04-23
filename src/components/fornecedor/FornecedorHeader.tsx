
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
      {isAdmin && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </header>
  );
}
