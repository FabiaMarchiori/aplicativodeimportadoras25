
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import FornecedorDetalhesCard from "@/components/fornecedor/FornecedorDetalhesCard";

const DetalheFornecedor = () => {
  const { id } = useParams<{ id: string }>();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchFornecedor();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchFornecedor = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

      if (error) throw error;
      setFornecedor(data ? mapFornecedor(data) : null);
    } catch (error) {
      console.error("Erro ao carregar fornecedor:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar fornecedor",
        description: "Não foi possível carregar os detalhes do fornecedor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in pb-24">
      <header className="mb-4 flex items-center">
        <Link to="/" className="text-primary mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-xl font-semibold">Detalhes do Fornecedor</h2>
      </header>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : fornecedor ? (
        <FornecedorDetalhesCard fornecedor={fornecedor} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Fornecedor não encontrado</p>
          <Link to="/" className="text-primary underline">Voltar para o início</Link>
        </div>
      )}
    </div>
  );
};

export default DetalheFornecedor;
