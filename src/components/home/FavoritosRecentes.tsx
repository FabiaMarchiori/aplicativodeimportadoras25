
import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { safeLog } from "@/utils/safeLogger";

const FavoritosRecentes = () => {
  const [favoritosRecentes, setFavoritosRecentes] = useState<Fornecedor[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavoritosRecentes();
    }
  }, [user]);

  const fetchFavoritosRecentes = async () => {
    try {
      const { data, error } = await supabase
        .from('favoritos')
        .select(`
          created_at,
          fornecedores (
            id,
            nome_loja,
            categoria,
            Whatsapp,
            Instagram_url,
            Endereco,
            logo_url,
            foto_destaque,
            mockup_url,
            localizacao,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      // Mapear os dados corretamente considerando a nova estrutura
      const mappedFornecedores = (data || [])
        .filter(item => item.fornecedores) // Filtrar apenas itens com fornecedores válidos
        .map(item => mapFornecedor(item.fornecedores));
      
      setFavoritosRecentes(mappedFornecedores);
    } catch (error) {
      safeLog.error("Erro ao carregar favoritos recentes", error);
    }
  };

  if (favoritosRecentes.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-bold text-[#111827]">Seus Favoritos Recentes</h2>
      </div>
      <div className="space-y-3">
        {favoritosRecentes.map((fornecedor) => (
          <Link key={fornecedor.id} to={`/fornecedor/${fornecedor.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-[#5FB9C3] p-0.5">
                    {fornecedor.logo_url ? (
                      <img
                        src={fornecedor.logo_url}
                        alt={`Logo ${fornecedor.nome}`}
                        className="w-full h-full object-contain transform scale-125"
                      />
                    ) : (
                      <div className="text-sm font-bold text-[#5FB9C3]">
                        {fornecedor.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-[#111827]">
                      {fornecedor.nome}
                    </h3>
                    <p className="text-xs text-gray-600">Favoritado recentemente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FavoritosRecentes;
