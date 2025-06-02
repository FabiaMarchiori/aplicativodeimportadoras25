
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Star, Crown } from "lucide-react";

const BonusSection = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-5 w-5 text-[#F9C820]" />
        <h2 className="text-xl font-bold text-[#111827]">Bônus Disponíveis</h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-gradient-to-r from-[#F9C820]/10 to-[#F9C820]/20 border-[#F9C820]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-[#F9C820]" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#111827]">Desconto Especial</h3>
                <p className="text-sm text-gray-600">5% de desconto em compras acima de R$ 500</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#5FB9C3]/10 to-[#5FB9C3]/20 border-[#5FB9C3]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-[#5FB9C3]" />
              <div className="flex-1">
                <h3 className="font-semibold text-[#111827]">Acesso VIP</h3>
                <p className="text-sm text-gray-600">Contatos diretos dos fornecedores premium</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BonusSection;
