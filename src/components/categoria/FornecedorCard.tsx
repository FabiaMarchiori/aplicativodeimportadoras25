
import { Fornecedor } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type FornecedorCardProps = {
  fornecedor: Fornecedor;
};

export default function FornecedorCard({ fornecedor }: FornecedorCardProps) {
  const navigate = useNavigate();
  
  return (
    <div
      className="cursor-pointer group flex flex-col items-center"
      onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
    >
      <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#3CBBC7] flex items-center justify-center overflow-hidden mb-3 transition-transform duration-300 hover:scale-110 p-2">
        <img
          src={fornecedor.logo_url || "/placeholder.svg"}
          alt={`Logo ${fornecedor.nome_loja || fornecedor.nome || ""}`}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-base font-semibold text-center text-[#322523] mt-2">
        {fornecedor.nome_loja || fornecedor.nome || "Sem nome"}
      </h3>
    </div>
  );
}
