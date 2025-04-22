import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Fornecedor, Categoria as CategoriaType, supabase, mapFornecedor, mapCategoria } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Loader2, ImageIcon, ArrowLeft, SearchIcon, Whatsapp, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Categoria() {
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState<CategoriaType | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchCategoria();
      fetchFornecedores();
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFornecedores(fornecedores);
    } else {
      const filtered = fornecedores.filter(fornecedor =>
        (fornecedor.nome_loja || fornecedor.nome || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFornecedores(filtered);
    }
  }, [searchQuery, fornecedores]);

  const fetchCategoria = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .eq("categoria", id)
        .maybeSingle();

      if (error) throw error;
      if (data) setCategoria(mapCategoria(data));
      else setCategoria(null);
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar categoria",
        description: "Não foi possível carregar os detalhes da categoria.",
      });
    }
  };

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("categoria", id)
        .order("nome_loja");
      if (error) throw error;
      const mappedFornecedores = (data || []).map(mapFornecedor);
      setFornecedores(mappedFornecedores);
      setFilteredFornecedores(mappedFornecedores);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar fornecedores",
        description: "Não foi possível carregar a lista de fornecedores.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <header className="mb-6">
        <div className="flex items-center mb-4">
          <Link to="/" className="text-primary mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold font-heading">
            {loading ? "Carregando..." : categoria?.categoria || "Categoria"}
          </h1>
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
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredFornecedores.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 slide-up">
          {filteredFornecedores.map((fornecedor) => (
            <Card
              key={fornecedor.id}
              className="overflow-hidden card-hover cursor-pointer"
              onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {fornecedor.logo_url ? (
                      <img
                        src={fornecedor.logo_url}
                        alt={`Logo ${fornecedor.nome_loja || fornecedor.nome}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-lg font-bold text-primary">
                        {(fornecedor.nome_loja || fornecedor.nome || "?").charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold truncate flex-1">{fornecedor.nome_loja || fornecedor.nome}</h3>
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div>
                    <Whatsapp className="inline-block mr-1 h-4 w-4" /> {fornecedor.Whatsapp || "-"}
                  </div>
                  <div>
                    <Instagram className="inline-block mr-1 h-4 w-4" /> {fornecedor.Instagram_url || "-"}
                  </div>
                  <div>
                    <span className="inline-block font-medium mr-1">Endereço:</span>
                    {fornecedor.Endereco || "-"}
                  </div>
                </div>
              </div>
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

      {/* Admin logic removed for brevity in this version */}
    </div>
  );
}
// File is getting long. Consider refactoring for maintainability.
