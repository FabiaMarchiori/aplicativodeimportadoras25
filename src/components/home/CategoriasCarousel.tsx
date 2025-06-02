
import { useState, useEffect } from "react";
import { Categoria, supabase, mapCategoria } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Grid } from "lucide-react";

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid className="h-5 w-5 text-[#5FB9C3]" />
          <h2 className="text-xl font-bold text-[#111827]">Categorias</h2>
        </div>
        <button 
          onClick={() => navigate('/categorias')}
          className="text-sm text-[#5FB9C3] hover:underline"
        >
          Ver todas
        </button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categorias.map((categoria) => (
            <CarouselItem key={categoria.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4">
              <div 
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate(`/categoria/${encodeURIComponent(categoria.categoria)}`)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-square flex items-center justify-center mb-2">
                    <img
                      src={categoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
                      alt={categoria.categoria}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-[#5FB9C3] text-center">
                    {categoria.categoria}
                  </h3>
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
