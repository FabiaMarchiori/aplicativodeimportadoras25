
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
    <header className="mb-6">
      <div className="flex flex-col items-center">
        <div className="mb-6">
          <div className="w-36 h-36 border-4 border-[#3CBBC7] shadow-md rounded-full flex items-center justify-center overflow-hidden p-1">
            {fornecedor.logo_url ? (
              <img 
                src={fornecedor.logo_url} 
                alt={fornecedor.nome} 
                className="w-full h-full object-contain transform scale-125" 
              />
            ) : (
              <div className="w-full h-full bg-[#3CBBC7]/10 text-[#3CBBC7] text-4xl rounded-full flex items-center justify-center">
                {fornecedor.nome?.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#322523]">{fornecedor.nome_loja || fornecedor.nome}</h1>
        <p className="text-gray-500 text-lg">{fornecedor.categoria}</p>
      </div>
      
      {isAdmin && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4 z-10 bg-white hover:bg-[#FBE02F]/20 border-[#3CBBC7]"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4 text-[#3CBBC7]" />
        </Button>
      )}
    </header>
  );
}
