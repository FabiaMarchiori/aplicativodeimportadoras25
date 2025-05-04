
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

type SearchHeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function SearchHeader({ searchQuery, setSearchQuery }: SearchHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold font-heading text-[#322523] mb-4">
        Buscar Fornecedores
      </h1>
      <div className="relative">
        <Input
          type="text"
          placeholder="Digite o nome do fornecedor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-[#3CBBC7] focus-visible:ring-[#3CBBC7]"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#3CBBC7]" />
      </div>
    </header>
  );
}
