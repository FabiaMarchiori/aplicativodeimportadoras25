
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  
  // Form data para registro
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

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
      setError(error.message || "Erro ao criar conta");
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
    <Card className="register-card border-white/20">
      <CardHeader className="text-white">
        <CardTitle className="text-white">Criar Conta</CardTitle>
        <CardDescription className="text-white/80">
          Cadastre-se para ter acesso a todos os fornecedores
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-white">E-mail</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="seu@email.com"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
              className="bg-white/10 text-white border-white/30 placeholder:text-white/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-white">Senha</Label>
            <Input
              id="register-password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
              className="bg-white/10 text-white border-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white">Confirmar Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              required
              className="bg-white/10 text-white border-white/30"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-white text-[#1981A7] hover:bg-white/90" 
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
