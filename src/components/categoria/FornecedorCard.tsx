
import { Fornecedor } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type FornecedorCardProps = {
  fornecedor: Fornecedor;
};

export default function FornecedorCard({ fornecedor }: FornecedorCardProps) {
  const navigate = useNavigate();
  
  return (
    <Card
      className="overflow-hidden cursor-pointer group p-4 flex flex-col items-center border-0 rounded-xl bg-white shadow transition-all hover:shadow-lg"
      onClick={() => navigate(`/fornecedor/${fornecedor.id}`)}
    >
      <div className="w-24 h-24 rounded-full border-4 border-[#D3B9B2] flex items-center justify-center overflow-hidden mb-3">
        <img
          src={fornecedor.logo_url || "/placeholder.svg"}
          alt={`Logo ${fornecedor.nome_loja || fornecedor.nome || ""}`}
          className="w-20 h-20 object-contain"
        />
      </div>
      <h3 className="text-base font-semibold text-[#322523] text-center">
        {fornecedor.nome_loja || fornecedor.nome || "Sem nome"}
      </h3>
    </Card>
  );
}
