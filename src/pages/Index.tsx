import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
const Index = () => {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  console.log('Index - Estado:', {
    user: !!user,
    loading
  });
  useEffect(() => {
    // Só redirecionar quando o loading terminar
    if (!loading) {
      console.log('Index - Redirecionando...', {
        user: !!user
      });
      if (user) {
        navigate("/home", {
          replace: true
        });
      } else {
        navigate("/login", {
          replace: true
        });
      }
    }
  }, [user, loading, navigate]);

  // Mostrar tela de loading enquanto verifica autenticação
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F4C75] via-[#3AAFA9] to-[#5FB9C3]">
      <div className="text-center text-white">
        
        <h1 className="text-3xl font-bold mb-4">Importadoras da 25 de Março</h1>
        <p className="text-white/90 mb-6">Carregando...</p>
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
      </div>
    </div>;
};
export default Index;