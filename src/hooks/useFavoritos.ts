
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFavoritos();
    } else {
      setFavoritos([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFavoritos = async () => {
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select('fornecedor_id')
        .eq('user_id', user?.id);

      if (error) throw error;

      const favoritoIds = (data || []).map(item => item.fornecedor_id);
      setFavoritos(favoritoIds);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = async (fornecedorId: number) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para favoritar fornecedores.",
      });
      return;
    }

    const isFavorito = favoritos.includes(fornecedorId);

    try {
      if (isFavorito) {
        // Remover favorito
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('user_id', user.id)
          .eq('fornecedor_id', fornecedorId);

        if (error) throw error;

        setFavoritos(prev => prev.filter(id => id !== fornecedorId));
        toast({
          title: "Removido dos favoritos",
          description: "Fornecedor removido da sua lista de favoritos.",
        });
      } else {
        // Adicionar favorito
        const { error } = await supabase
          .from('favoritos')
          .insert({
            user_id: user.id,
            fornecedor_id: fornecedorId
          });

        if (error) throw error;

        setFavoritos(prev => [...prev, fornecedorId]);
        toast({
          title: "Adicionado aos favoritos",
          description: "Fornecedor adicionado à sua lista de favoritos.",
        });
      }
    } catch (error) {
      console.error("Erro ao gerenciar favorito:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar seus favoritos. Tente novamente.",
      });
    }
  };

  const isFavorito = (fornecedorId: number) => favoritos.includes(fornecedorId);

  return {
    favoritos,
    loading,
    toggleFavorito,
    isFavorito,
    refetchFavoritos: fetchFavoritos
  };
}
