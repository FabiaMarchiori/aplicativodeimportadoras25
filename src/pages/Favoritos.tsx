
import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { FavoritoButton } from "@/components/FavoritoButton";
import { useFavoritos } from "@/hooks/useFavoritos";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { toggleFavorito, isFavorito, refetchFavoritos } = useFavoritos();

  useEffect(() => {
    if (user) {
      fetchFavoritos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavoritos = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('fornecedores')
        .select(`
          *,
          favoritos!inner(user_id)
        `)
        .eq('favoritos.user_id', user?.id);
      
      if (error) {
        console.error("Error details:", error);
        setFavoritos([]);
        return;
      }
      
      const mappedFornecedores = (data || []).map(mapFornecedor);
      setFavoritos(mappedFornecedores);
      
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar favoritos",
        description: "Não foi possível carregar seus fornecedores favoritos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorito = async (fornecedorId: number) => {
    await toggleFavorito(fornecedorId);
    // Recarregar a lista de favoritos após remoção
    await fetchFavoritos();
    await refetchFavoritos();
  };

  return (
    <div className="page-container fade-in">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-primary font-heading">Meus Favoritos</h1>
        <p className="text-muted-foreground">Fornecedores que você salvou</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : favoritos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 slide-up">
          {favoritos.map((fornecedor) => (
            <Card key={fornecedor.id} className="overflow-hidden card-hover relative">
              <FavoritoButton
                isFavorito={isFavorito(fornecedor.id)}
                onToggle={() => handleToggleFavorito(fornecedor.id)}
                size="sm"
                className="absolute top-2 right-2 z-10"
              />
              
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center p-0.5">
                    {fornecedor.logo_url ? (
                      <img
                        src={fornecedor.logo_url}
                        alt={`Logo ${fornecedor.nome}`}
                        className="w-full h-full object-contain transform scale-125"
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
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg text-muted-foreground">
            Você ainda não tem favoritos
          </p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/">Explorar fornecedores</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
