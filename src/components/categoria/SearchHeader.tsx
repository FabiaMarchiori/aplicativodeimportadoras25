
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ArrowLeft, SearchIcon } from "lucide-react";
import { Categoria } from "@/lib/supabase";

type SearchHeaderProps = {
  categoria: Categoria | null;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function SearchHeader({ 
  categoria, 
  loading, 
  searchQuery, 
  setSearchQuery 
}: SearchHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Link to="/" className="text-primary mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold font-heading">
            {loading ? "Carregando..." : categoria?.categoria || "Categoria"}
          </h1>
        </div>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar fornecedor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </header>
  );
}
