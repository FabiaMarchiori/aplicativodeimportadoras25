
import { useNavigate } from "react-router-dom";
import { Categoria } from "@/lib/supabase";

interface CategoryCardProps {
  categoria: Categoria;
}

const CategoryCard = ({ categoria }: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="cursor-pointer hover:scale-105 transition-transform"
      onClick={() => navigate(`/categoria/${encodeURIComponent(categoria.categoria)}`)}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full h-48 flex items-center justify-center mb-3">
          <img
            src={categoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
            alt={categoria.categoria}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-[#3CBBC7]">{categoria.categoria}</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
