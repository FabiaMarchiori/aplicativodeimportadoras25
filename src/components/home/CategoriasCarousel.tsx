
import { useState, useEffect } from "react";
import { Categoria, supabase, mapCategoria } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Grid, ArrowRight } from "lucide-react";

const CategoriasCarousel = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("categoria");

      if (error) throw error;
      const mappedCategorias = (data || []).map(mapCategoria);
      setCategorias(mappedCategorias);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Grid className="h-6 w-6 text-[#5FB9C3]" />
            <h2 className="text-2xl font-bold text-[#111827]">Explore por Categorias</h2>
          </div>
          <p className="text-gray-600">Encontre fornecedores organizados por categoria</p>
        </div>
        <button 
          onClick={() => navigate('/categorias')}
          className="flex items-center gap-2 text-[#5FB9C3] hover:text-[#3CBBC7] font-medium transition-colors"
        >
          Ver todas
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categorias.map((categoria) => (
            <CarouselItem key={categoria.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
              <div 
                className="group cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => navigate(`/categoria/${encodeURIComponent(categoria.categoria)}`)}
              >
                <div className="flex flex-col items-center p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-full aspect-square flex items-center justify-center mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-[#5FB9C3]/5 to-[#5FB9C3]/10 group-hover:from-[#5FB9C3]/10 group-hover:to-[#5FB9C3]/20 transition-colors">
                    <img
                      src={categoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
                      alt={categoria.categoria}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-[#111827] text-center group-hover:text-[#5FB9C3] transition-colors">
                    {categoria.categoria}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoriasCarousel;
