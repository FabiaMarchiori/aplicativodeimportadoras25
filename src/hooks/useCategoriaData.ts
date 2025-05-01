
import { useState, useEffect } from "react";
import { Fornecedor, Categoria, supabase, mapFornecedor, mapCategoria } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function useCategoriaData(categoriaId: string | undefined) {
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (categoriaId) {
      fetchCategoria();
      fetchFornecedores();
    }
    // eslint-disable-next-line
  }, [categoriaId]);

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
        .eq("categoria", categoriaId)
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
        .eq("categoria", categoriaId)
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

  return {
    categoria,
    fornecedores,
    filteredFornecedores,
    loading,
    searchQuery,
    setSearchQuery,
    fetchFornecedores
  };
}
