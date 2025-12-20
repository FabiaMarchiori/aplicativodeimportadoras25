import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const getErrorMessage = (error: any) => {
    if (!error) return "Erro desconhecido";
    
    const errorMessage = error.message || error.error_description || error.toString();
    
    if (errorMessage.includes('invalid email') || errorMessage.includes('Invalid email')) {
      return "E-mail inválido. Verifique o endereço e tente novamente.";
    }

    if (errorMessage.includes('already registered') || errorMessage.includes('User already registered')) {
      return "Este e-mail já está cadastrado. Tente fazer login.";
    }

    if (errorMessage.includes('Password should') || errorMessage.includes('password')) {
      return "Senha inválida. Use no mínimo 8 caracteres incluindo letra maiúscula, minúscula, número e símbolo.";
    }

    if (errorMessage.includes('Too many requests')) {
      return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    }

    if (errorMessage.includes('connection refused') || errorMessage.includes('fetch')) {
      return "Problema de conexão. Verifique sua internet e tente novamente.";
    }
    
    return "Ocorreu um erro ao criar conta. Tente novamente.";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    const { error, data } = await signUp(registerData.email, registerData.password);
    
    if (error) {
      setError(getErrorMessage(error));
      setIsLoading(false);
      return;
    }

    if (data) {
      toast({
        title: "Registro bem-sucedido",
        description: "Sua conta foi criada. Verifique seu e-mail para confirmar o registro.",
        duration: 5000
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl animate-fade-in">
      <CardHeader className="text-white text-center pb-4">
        <div className="mx-auto mb-4 relative">
          <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500/30 to-cyan-400/20 
                          border border-cyan-400/30 rounded-full flex items-center justify-center">
            <UserPlus className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          </div>
        </div>
        <CardTitle className="text-white text-2xl font-bold">Criar Conta</CardTitle>
        <CardDescription className="text-white/70">
          Cadastre-se para ter acesso a todos os fornecedores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-500/20 border-red-400/30 animate-fade-in">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Google Auth Button */}
        <GoogleAuthButton mode="signup" />
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0b2a3f] px-3 text-white/50">Ou continue com</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-white/70 text-sm">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70 w-4 h-4" />
              <Input
                id="register-email"
                type="email"
                placeholder="seu@email.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
                className="bg-white/10 text-white border-white/20 rounded-xl pl-10 h-12
                           placeholder:text-white/40
                           focus:border-cyan-400/50 focus:ring-cyan-400/20
                           focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]
                           transition-all duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-white/70 text-sm">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70 w-4 h-4" />
              <Input
                id="register-password"
                type="password"
                placeholder="Crie uma senha forte"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                className="bg-white/10 text-white border-white/20 rounded-xl pl-10 h-12
                           placeholder:text-white/40
                           focus:border-cyan-400/50 focus:ring-cyan-400/20
                           focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]
                           transition-all duration-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white/70 text-sm">Confirmar Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70 w-4 h-4" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirme sua senha"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
                className="bg-white/10 text-white border-white/20 rounded-xl pl-10 h-12
                           placeholder:text-white/40
                           focus:border-cyan-400/50 focus:ring-cyan-400/20
                           focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]
                           transition-all duration-300"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white text-[#061a2e] font-semibold h-12 rounded-xl
                       hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]
                       hover:scale-[1.02]
                       transition-all duration-300 mt-2" 
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
