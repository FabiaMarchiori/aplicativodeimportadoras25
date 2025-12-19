
import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
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
      
      // Usando consulta com RPC para evitar duplicação por nome_loja
      const { data, error } = await supabase.rpc('get_distinct_fornecedores');

      if (error) {
        // Fallback para consulta direta caso a função RPC não exista
        console.warn("RPC function not found, using direct query with distinct");
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("fornecedores")
          .select("*")
          .order("nome_loja", { ascending: true })
          .order("id", { ascending: true });
          
        if (fallbackError) throw fallbackError;
        
        // Remover duplicatas manualmente baseado no nome_loja
        const uniqueFornecedores = fallbackData?.reduce((acc: any[], current: any) => {
          const exists = acc.find(item => item.nome_loja === current.nome_loja);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []) || [];
        
        const mappedFornecedores = uniqueFornecedores.map(mapFornecedor);
        setFornecedores(mappedFornecedores);
      } else {
        const mappedFornecedores = (data || []).map(mapFornecedor);
        setFornecedores(mappedFornecedores);
      }
      
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
    <div className="min-h-screen bg-[#0B1A2A] px-4 py-6 fade-in">
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
