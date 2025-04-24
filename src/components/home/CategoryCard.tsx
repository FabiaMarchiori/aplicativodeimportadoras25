
import { useNavigate } from "react-router-dom";
import { Categoria } from "@/lib/supabase";

interface CategoryCardProps {
  categoria: Categoria;
}

const CategoryCard = ({ categoria }: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Garantir que a categoria seja codificada corretamente para a URL
    const encodedCategoria = encodeURIComponent(categoria.categoria);
    console.log("Navegando para categoria:", categoria.categoria);
    console.log("Categoria codificada:", encodedCategoria);
    navigate(`/categoria/${encodedCategoria}`);
  };

  return (
    <div 
      className="cursor-pointer hover:scale-105 transition-transform"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col border-2 border-black">
        <div className="w-full h-48 flex items-center justify-center p-4">
          <img
            src={categoria.imagem_url || "https://source.unsplash.com/random/300x200/?shop"}
            alt={categoria.categoria}
            className="max-w-full max-h-full object-contain rounded"
          />
        </div>
        <div className="p-4 text-center flex-grow flex items-center justify-center bg-gray-50">
          <h3 className="font-bold text-black">{categoria.categoria}</h3>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
