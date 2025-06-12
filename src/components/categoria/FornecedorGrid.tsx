
import { Fornecedor } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FornecedorCard from "./FornecedorCard";

type FornecedorGridProps = {
  fornecedores: Fornecedor[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function FornecedorGrid({ 
  fornecedores, 
  loading, 
  searchQuery, 
  setSearchQuery 
}: FornecedorGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fornecedores.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Nenhum fornecedor encontrado</p>
        {searchQuery && (
          <Button variant="link" onClick={() => setSearchQuery("")}>
            Limpar busca
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 px-2 mb-10">
      {fornecedores.map((fornecedor) => (
        <FornecedorCard key={fornecedor.id} fornecedor={fornecedor} />
      ))}
    </div>
  );
}
