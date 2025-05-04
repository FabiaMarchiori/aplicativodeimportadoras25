
import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import SearchBanner from "@/components/search/SearchBanner";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";

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
      <SearchBanner />
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SearchResults 
        filteredFornecedores={filteredFornecedores}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
