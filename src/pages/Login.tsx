
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
  const { user } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Redirect to the page the user was trying to access, or home if none
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

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
        <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
          <TabsTrigger 
            value="login" 
            className="data-[state=active]:bg-white/20 text-white"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="register" 
            className="data-[state=active]:bg-white/20 text-white"
          >
            Cadastro
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-4">
          <LoginForm onForgotPassword={() => setForgotPasswordOpen(true)} />
        </TabsContent>
        
        <TabsContent value="register" className="mt-4">
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
