
import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { FavoritoButton } from "@/components/FavoritoButton";
import { useFavoritos } from "@/hooks/useFavoritos";
import { Link } from "react-router-dom";
import { TrendingUp, Star, MapPin } from "lucide-react";

const DestaquesSemana = () => {
  const [destaques, setDestaques] = useState<Fornecedor[]>([]);
  const { toggleFavorito, isFavorito } = useFavoritos();

  useEffect(() => {
    fetchDestaques();
  }, []);

  const fetchDestaques = async () => {
    try {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .limit(6);

      if (error) throw error;
      const mappedFornecedores = (data || []).map(mapFornecedor);
      setDestaques(mappedFornecedores);
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
    }
  };

  if (destaques.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-[#5FB9C3]" />
            <h2 className="text-2xl font-bold text-[#111827]">Destaques da Semana</h2>
          </div>
          <p className="text-gray-600">Os fornecedores mais procurados pelos nossos usuários</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destaques.map((fornecedor, index) => (
          <Card key={fornecedor.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <FavoritoButton
              isFavorito={isFavorito(fornecedor.id)}
              onToggle={() => toggleFavorito(fornecedor.id)}
              size="sm"
              className="absolute top-3 right-3 z-10"
            />
            
            {/* Badge de destaque */}
            {index < 3 && (
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-gradient-to-r from-[#F9C820] to-[#E6B41D] text-white text-xs font-bold px-2 py-1 rounded-full">
                  #{index + 1} TRENDING
                </div>
              </div>
            )}
            
            <Link to={`/fornecedor/${fornecedor.id}`}>
              <CardContent className="p-0">
                {/* Imagem de destaque ou placeholder */}
                <div className="h-48 bg-gradient-to-br from-[#5FB9C3]/10 to-[#5FB9C3]/20 flex items-center justify-center">
                  {fornecedor.foto_destaque ? (
                    <img
                      src={fornecedor.foto_destaque}
                      alt={`Destaque ${fornecedor.nome}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[#5FB9C3] flex items-center justify-center">
                        {fornecedor.logo_url ? (
                          <img
                            src={fornecedor.logo_url}
                            alt={`Logo ${fornecedor.nome}`}
                            className="w-full h-full object-contain rounded-full"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {fornecedor.nome.charAt(0)}
                          </span>
                        )}
                      </div>
                      <p className="text-[#5FB9C3] font-medium">Ver Fornecedor</p>
                    </div>
                  )}
                </div>
                
                {/* Informações do fornecedor */}
                <div className="p-4">
                  <h3 className="font-bold text-[#111827] mb-2 text-lg">
                    {fornecedor.nome}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {fornecedor.Endereco || "25 de Março"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-[#F9C820] fill-current" />
                      <span className="text-sm font-medium text-gray-700">4.8</span>
                      <span className="text-xs text-gray-500">(234 avaliações)</span>
                    </div>
                    <div className="text-xs text-[#5FB9C3] font-medium">
                      Em alta
                    </div>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DestaquesSemana;
