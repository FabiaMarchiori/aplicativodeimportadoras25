
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Categoria = () => {
  const { categoriaNome } = useParams<{ categoriaNome: string }>();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!categoriaNome) {
      console.error("Nome da categoria não encontrado na URL");
      setError("Nome da categoria não encontrado");
      setLoading(false);
      return;
    }
    
    const decodedCategoria = decodeURIComponent(categoriaNome);
    console.log("Categoria decodificada:", decodedCategoria);
    fetchFornecedoresPorCategoria(decodedCategoria);
  }, [categoriaNome]);

  const fetchFornecedoresPorCategoria = async (categoria: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando fornecedores para categoria:", categoria);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("categoria", categoria);

      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }

      console.log("Dados retornados do Supabase:", data);
      const mappedFornecedores = data
        ? data.map((fornecedor) => mapFornecedor(fornecedor))
        : [];
      setFornecedores(mappedFornecedores);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      setError("Não foi possível carregar os fornecedores desta categoria.");
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
      <div className="flex items-center mb-4 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mr-2 p-2 rounded-full hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-6 w-6 text-black" />
        </button>
        <h1 className="text-2xl font-bold text-center text-black flex-1 pr-8">
          {categoriaNome ? decodeURIComponent(categoriaNome) : "Categoria"}
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-12 space-y-6">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
          <p className="text-black">Carregando fornecedores...</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="w-32 h-32 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-black">
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => {
              if (categoriaNome) {
                fetchFornecedoresPorCategoria(decodeURIComponent(categoriaNome));
              }
            }}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md"
          >
            Tentar novamente
          </button>
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
        <div className="text-center py-12 text-black">
          <p className="text-lg">Nenhum fornecedor encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
};

export default Categoria;
