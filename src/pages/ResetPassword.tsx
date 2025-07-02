
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("ResetPassword component mounted");
    console.log("Current location:", location.pathname);
    console.log("Current URL:", window.location.href);
  }, [location]);

  useEffect(() => {
    const handlePasswordReset = async () => {
      setIsLoading(true);
      setError("");

      // Tenta obter a sessão do Supabase. Se o link de redefinição for válido,
      // o Supabase SDK já deve ter processado os tokens da URL.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        // Se não houver sessão ou houver erro, o link é inválido/expirado.
        setError("Link de redefinição de senha inválido ou expirado.");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      // Se chegou aqui, significa que a sessão foi estabelecida com sucesso.
      // O formulário de redefinição de senha pode ser exibido.
      setIsLoading(false);
    };

    // Chama a função ao carregar o componente
    handlePasswordReset();

    // Opcional: Adicionar um listener para mudanças de estado de autenticação
    // para casos onde a sessão pode ser processada um pouco depois.
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Esta parte é mais para garantir que o estado do UI reflita a sessão
      // caso ela mude após o carregamento inicial, mas a lógica principal
      // de validação do link é feita no handlePasswordReset inicial.
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Starting password reset process...");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to update password...");
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("Error updating password:", error);
        throw error;
      }

      console.log("Password updated successfully");
      toast({
        title: "Senha alterada com sucesso",
        description: "Você pode fazer login com sua nova senha agora.",
        duration: 5000
      });

      // Redirect to login page after successful password reset
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setError(error.message || "Erro ao redefinir sua senha. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-screen p-4 fade-in">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cyanBlue">Lista de Importadora da 25 de Março</h1>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-screen p-4 fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cyanBlue">Lista de Importadora da 25 de Março</h1>
          <p className="text-muted-foreground">Redefinir sua senha</p>
          <p className="text-xs text-gray-500 mt-2">Rota: {location.pathname}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nova Senha</CardTitle>
            <CardDescription>
              Crie uma nova senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Atualizando..." : "Redefinir Senha"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
