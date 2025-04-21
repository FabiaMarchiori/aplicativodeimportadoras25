import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SearchIcon, Loader2 } from "lucide-react";

export default function Busca() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFornecedores, setFilteredFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFornecedores();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFornecedores(fornecedores);
    } else {
      const filtered = fornecedores.filter(fornecedor =>
        fornecedor.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFornecedores(filtered);
    }
  }, [searchQuery, fornecedores]);

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome_loja");

      if (error) throw error;
      const mappedFornecedores = (data || []).map(mapFornecedor);
      setFornecedores(mappedFornecedores);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      toast({
        variant: "destructive",
        title: "Erro ao buscar fornecedores",
        description: "Não foi possível carregar a lista de fornecedores.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-bold font-heading mb-4">Buscar Fornecedores</h1>
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

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredFornecedores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 slide-up">
          {filteredFornecedores.map((fornecedor) => (
            <Card key={fornecedor.id} className="overflow-hidden card-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {fornecedor.logo_url ? (
                      <img
                        src={fornecedor.logo_url}
                        alt={`Logo ${fornecedor.nome}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-lg font-bold text-primary">
                        {fornecedor.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold truncate flex-1">{fornecedor.nome}</h3>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full" variant="default">
                  <Link to={`/fornecedor/${fornecedor.id}`}>
                    Ver detalhes
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhum fornecedor encontrado</p>
          {searchQuery && (
            <Button variant="link" onClick={() => setSearchQuery("")}>
              Limpar busca
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
