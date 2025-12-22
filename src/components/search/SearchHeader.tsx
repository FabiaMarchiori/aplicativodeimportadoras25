
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

type SearchHeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const MAX_SEARCH_LENGTH = 100;

export default function SearchHeader({ searchQuery, setSearchQuery }: SearchHeaderProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit input length to prevent performance issues
    if (value.length <= MAX_SEARCH_LENGTH) {
      setSearchQuery(value);
    }
  };

  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold font-heading text-white mb-4">
        Buscar Fornecedores
      </h1>
      <div className="relative">
        <Input
          type="text"
          placeholder="Digite o nome do fornecedor..."
          value={searchQuery}
          onChange={handleSearchChange}
          maxLength={MAX_SEARCH_LENGTH}
          className="pl-10 bg-[#0D2238]/80 border-cyan-400/30 text-white placeholder:text-gray-400 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
      </div>
    </header>
  );
}
