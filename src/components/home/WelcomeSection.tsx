
import { useAuth } from "@/contexts/AuthContext";

const WelcomeSection = () => {
  const { user } = useAuth();
  
  const firstName = user?.user_metadata?.first_name || "Usuário";
  
  return (
    <div className="bg-gradient-to-r from-[#5FB9C3] to-[#3CBBC7] text-white p-6 rounded-lg mb-6">
      <h1 className="text-2xl font-bold mb-2">
        Olá, {firstName}! 👋
      </h1>
      <p className="text-white/90 mb-4">
        Pronto para descobrir os melhores fornecedores da 25 de Março?
      </p>
      <div className="flex gap-3">
        <button className="bg-[#F9C820] text-[#111827] px-6 py-3 rounded-lg font-semibold hover:bg-[#F9C820]/90 transition-colors">
          Encontrar Roteiro
        </button>
        <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
          Ver Mapa
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
