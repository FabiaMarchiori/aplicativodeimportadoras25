
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col border-2 border-yellow-400">
        <div className="w-full h-48 flex items-center justify-center p-4">
          <img
            src={categoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
            alt={categoria.categoria}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
        <div className="p-4 text-center flex-grow flex items-center justify-center bg-yellow-50">
          <h3 className="font-bold text-yellow-700">{categoria.categoria}</h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
