
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { safeLog } from "@/utils/safeLogger";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, hasActiveSubscription, isAdmin, dataLoaded } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  safeLog.debug('Login - Estado', { hasUser: !!user, loading, dataLoaded, hasActiveSubscription, isAdmin });

  // Redirect if already logged in - verificar admin OU assinatura
  // IMPORTANTE: Só redirecionar quando loading=false E dataLoaded=true
  useEffect(() => {
    if (!loading && user && dataLoaded) {
      safeLog.debug('Login - Usuário já logado e dados carregados, verificando acesso');
      if (hasActiveSubscription || isAdmin) {
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      } else {
        navigate('/acesso-negado', { replace: true });
      }
    }
  }, [user, loading, dataLoaded, hasActiveSubscription, isAdmin, navigate, location]);

  // Se ainda está carregando, mostrar tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1a2e]">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Verificando autenticação...</p>
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
        <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-white/10">
          <TabsTrigger 
            value="login" 
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white 
                       text-white/70 rounded-lg transition-all duration-300
                       data-[state=active]:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="register" 
            className="data-[state=active]:bg-white/20 data-[state=active]:text-white 
                       text-white/70 rounded-lg transition-all duration-300
                       data-[state=active]:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
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
