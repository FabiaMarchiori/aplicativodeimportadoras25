
import { useState, useEffect } from "react";
import { Fornecedor, supabase, mapFornecedor } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { FavoritoButton } from "@/components/FavoritoButton";
import { useFavoritos } from "@/hooks/useFavoritos";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

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
        .limit(4);

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
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#5FB9C3]" />
        <h2 className="text-xl font-bold text-[#111827]">Destaques da Semana</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {destaques.map((fornecedor) => (
          <Card key={fornecedor.id} className="relative overflow-hidden">
            <FavoritoButton
              isFavorito={isFavorito(fornecedor.id)}
              onToggle={() => toggleFavorito(fornecedor.id)}
              size="sm"
              className="absolute top-2 right-2 z-10"
            />
            <Link to={`/fornecedor/${fornecedor.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-[#5FB9C3] p-0.5">
                    {fornecedor.logo_url ? (
                      <img
                        src={fornecedor.logo_url}
                        alt={`Logo ${fornecedor.nome}`}
                        className="w-full h-full object-contain transform scale-125"
                      />
                    ) : (
                      <div className="text-lg font-bold text-[#5FB9C3]">
                        {fornecedor.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-[#111827] truncate">
                      {fornecedor.nome}
                    </h3>
                    <p className="text-xs text-gray-600">Em alta</p>
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
