
import { Card, CardContent } from "@/components/ui/card";
import { Crown, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PromoBanner = () => {
  const { hasActiveSubscription } = useAuth();

  // Se já tem assinatura ativa, não mostrar o banner
  if (hasActiveSubscription) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-[#5FB9C3] to-[#3CBBC7] text-white mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-[#F9C820]" />
            <div>
              <h3 className="text-lg font-bold">Plano Anual Premium</h3>
              <p className="text-white/90 text-sm">
                Acesso completo + bônus exclusivos
              </p>
            </div>
          </div>
          <a
            href="https://pay.kiwify.com.br/0FciBP1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F9C820] text-[#111827] px-4 py-2 rounded-lg font-semibold hover:bg-[#F9C820]/90 transition-colors flex items-center gap-2"
          >
            Assinar
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoBanner;
