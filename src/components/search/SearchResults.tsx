
import { Fornecedor } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FornecedorSearchCard from "./FornecedorSearchCard";

type SearchResultsProps = {
  filteredFornecedores: Fornecedor[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function SearchResults({ 
  filteredFornecedores, 
  loading, 
  searchQuery, 
  setSearchQuery 
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#3CBBC7]" />
      </div>
    );
  }

  if (filteredFornecedores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-[#322523] mb-4">Nenhum fornecedor encontrado</p>
        {searchQuery && (
          <Button 
            variant="link" 
            onClick={() => setSearchQuery("")}
            className="text-[#3CBBC7]"
          >
            Limpar busca
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 slide-up">
      {filteredFornecedores.map((fornecedor) => (
        <FornecedorSearchCard key={fornecedor.id} fornecedor={fornecedor} />
      ))}
    </div>
  );
}
