import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { FavoritoButton } from "@/components/FavoritoButton";
import { useFavoritos } from "@/hooks/useFavoritos";

// Componente de partículas de fundo
const ParticlesBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-cyan-400/10"
        style={{
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 8 + 4}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `particleFloat ${25 + Math.random() * 15}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

// Estado vazio com visual premium
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    {/* Ícone com glow */}
    <div className="relative mb-6">
      <div className="absolute inset-0 blur-xl bg-cyan-400/20 rounded-full scale-150" />
      <Heart className="h-16 w-16 text-cyan-400 relative z-10" strokeWidth={1.5} />
    </div>
    
    {/* Textos */}
    <h2 className="text-xl font-semibold text-white mb-2">
      Seus favoritos aparecerão aqui
    </h2>
    <p className="text-white/60 mb-8 max-w-xs">
      Salve fornecedores para acessar rapidamente depois
    </p>
    
    {/* CTA Button */}
    <Button 
      asChild 
      className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#0a1628] font-semibold 
                 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300
                 border-none"
    >
      <Link to="/categorias">Explorar fornecedores</Link>
    </Button>
  </div>
);

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
    await fetchFavoritos();
    await refetchFavoritos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1a2e] relative">
      {/* Noise overlay */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-0" />
      
      {/* Partículas */}
      <ParticlesBackground />
      
      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-4 pb-24 pt-6">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white font-heading">Meus Favoritos</h1>
          <p className="text-white/60">Fornecedores que você salvou</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : favoritos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritos.map((fornecedor) => (
              <div 
                key={fornecedor.id} 
                className="glass-card relative overflow-hidden transition-all duration-300 
                           hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_25px_rgba(34,211,238,0.15)]
                           hover:-translate-y-1 group"
              >
                {/* Botão Favorito - canto superior direito */}
                <FavoritoButton
                  isFavorito={isFavorito(fornecedor.id)}
                  onToggle={() => handleToggleFavorito(fornecedor.id)}
                  size="sm"
                  className="absolute top-3 right-3 z-10"
                />
                
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    {/* Logo em disco branco */}
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                      {fornecedor.logo_url ? (
                        <img
                          src={fornecedor.logo_url}
                          alt={`Logo ${fornecedor.nome}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-[#0a1628]">
                          {fornecedor.nome.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    {/* Nome do fornecedor */}
                    <h3 className="font-semibold text-white text-lg truncate flex-1 pr-8">
                      {fornecedor.nome}
                    </h3>
                  </div>
                  
                  {/* Botão Ver detalhes */}
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full border-cyan-400/50 text-cyan-400 bg-transparent
                               hover:bg-cyan-400 hover:text-[#0a1628] hover:border-cyan-400 
                               transition-all duration-300"
                  >
                    <Link to={`/fornecedor/${fornecedor.id}`}>
                      Ver detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
