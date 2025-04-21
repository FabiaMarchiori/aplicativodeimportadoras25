
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fornecedor, supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search as SearchIcon } from "lucide-react";

export default function Busca() {
  const [query, setQuery] = useState("");
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllFornecedores();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredFornecedores([]);
    } else {
      const filtered = fornecedores.filter(fornecedor =>
        fornecedor.nome.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFornecedores(filtered);
    }
  }, [query, fornecedores]);

  const fetchAllFornecedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome");

      if (error) throw error;
      setFornecedores(data || []);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar fornecedores",
        description: "Não foi possível carregar a lista de fornecedores. Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary font-heading">Buscar Fornecedores</h1>
        <p className="text-muted-foreground">Encontre fornecedores pelo nome</p>
      </header>

      <div className="relative mb-8">
        <Input
          type="text"
          placeholder="Digite o nome do fornecedor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : query.trim() === "" ? (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Digite o nome de um fornecedor para buscar
          </p>
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
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhum fornecedor encontrado com "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
