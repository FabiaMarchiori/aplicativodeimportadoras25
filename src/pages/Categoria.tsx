
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Categoria = () => {
  const { categoriaNome } = useParams<{ categoriaNome: string }>();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (categoriaNome) {
      fetchFornecedoresPorCategoria(decodeURIComponent(categoriaNome));
    }
  }, [categoriaNome]);

  const fetchFornecedoresPorCategoria = async (categoria: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("categoria", categoria);

      if (error) throw error;

      const mappedFornecedores = data
        ? data.map((fornecedor) => mapFornecedor(fornecedor))
        : [];
      setFornecedores(mappedFornecedores);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar fornecedores",
        description:
          "Não foi possível carregar os fornecedores desta categoria.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in bg-white">
      <h1 className="text-2xl font-bold text-center text-black mb-4">
        {decodeURIComponent(categoriaNome || "")}
      </h1>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      ) : fornecedores.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
          {fornecedores.map((fornecedor) => (
            <div
              key={fornecedor.id}
              className="flex flex-col items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
            >
              <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden flex items-center justify-center">
                <img
                  src={fornecedor.logo_url || "/placeholder.svg"}
                  alt={fornecedor.nome_loja}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-center font-medium text-black">
                {fornecedor.nome_loja}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhum fornecedor encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
};

export default Categoria;
