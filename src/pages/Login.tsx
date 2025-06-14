
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  console.log('Login - Estado:', { user: !!user, loading });

  // Redirect if already logged in - mas só quando não está loading
  useEffect(() => {
    if (!loading && user) {
      console.log('Login - Usuário já logado, redirecionando...');
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Se ainda está carregando, mostrar tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F4C75] via-[#3AAFA9] to-[#5FB9C3]">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se o usuário já está logado, não renderizar nada (vai redirecionar)
  if (user) {
    return null;
  }

  // Determinar classes com base na guia ativa
  const containerClass = activeTab === "login" ? "login-container" : "register-container";

  return (
    <AuthLayout containerClass={containerClass}>
      <Tabs 
        defaultValue="login" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white backdrop-blur-sm">
          <TabsTrigger 
            value="login" 
            className="data-[state=active]:bg-white/20 text-white transition-all duration-200"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="register" 
            className="data-[state=active]:bg-white/20 text-white transition-all duration-200"
          >
            Cadastro
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-6">
          <LoginForm onForgotPassword={() => setForgotPasswordOpen(true)} />
        </TabsContent>
        
        <TabsContent value="register" className="mt-6">
          <RegisterForm />
        </TabsContent>
      </Tabs>

      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </AuthLayout>
  );
}
