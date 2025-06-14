
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "./GoogleAuthButton";

type LoginFormProps = {
  onForgotPassword: () => void;
};

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      console.error("Login error:", error);
      setError(error.message || "E-mail ou senha inválidos");
      setIsLoading(false);
      return;
    }

    toast({
      title: "Login bem-sucedido",
      description: "Você foi autenticado com sucesso.",
      duration: 3000
    });

    setIsLoading(false);
    navigate("/");
  };

  return (
    <Card className="login-card border-white/20 backdrop-blur-sm bg-white/10 shadow-2xl animate-fade-in">
      <CardHeader className="text-white text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-white text-2xl font-bold">Bem-vindo</CardTitle>
        <CardDescription className="text-white/80">
          Acesse sua conta para gerenciar seus fornecedores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-red-500/20 border-red-300/30 animate-scale-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {/* Google Auth Button */}
        <GoogleAuthButton mode="login" />
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-white/70">Ou continue com</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="bg-white/10 text-white border-white/30 placeholder:text-white/60 pl-10 h-12 transition-all duration-200 focus:bg-white/20 focus:border-white/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white font-medium">Senha</Label>
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto text-xs text-white hover:text-white/80 transition-colors"
                onClick={onForgotPassword}
              >
                Esqueceu a senha?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="bg-white/10 text-white border-white/30 pl-10 pr-10 h-12 transition-all duration-200 focus:bg-white/20 focus:border-white/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white text-[#5FB9C3] hover:bg-white/90 h-12 font-semibold transition-all duration-200 hover:scale-105" 
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
