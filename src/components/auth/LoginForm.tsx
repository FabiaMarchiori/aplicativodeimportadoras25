
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type LoginFormProps = {
  onForgotPassword: () => void;
};

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    <Card className="login-card border-white/20">
      <CardHeader className="text-white">
        <CardTitle className="text-white">Entrar</CardTitle>
        <CardDescription className="text-white/80">
          Acesse sua conta para gerenciar seus fornecedores
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
              className="bg-white/10 text-white border-white/30 placeholder:text-white/60"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto text-xs text-white hover:text-white/80"
                onClick={onForgotPassword}
              >
                Esqueceu a senha?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
              className="bg-white/10 text-white border-white/30"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-white text-[#5FB9C3] hover:bg-white/90" 
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
