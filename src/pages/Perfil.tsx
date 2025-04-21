
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, User, LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function Perfil() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password.newPassword !== password.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (password.newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      // Primeiro, verifique a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: password.currentPassword,
      });

      if (signInError) {
        throw new Error("Senha atual incorreta");
      }

      // Agora atualize a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: password.newPassword,
      });

      if (updateError) throw updateError;

      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi atualizada com sucesso",
      });

      setModalOpen(false);
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setError(error.message || "Erro ao alterar a senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar esta página.
          </p>
          <Button onClick={() => navigate("/login")}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-md mx-auto fade-in">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center">{user.email}</CardTitle>
          {isAdmin && (
            <CardDescription className="flex items-center justify-center gap-1 mt-1 text-primary">
              <ShieldAlert className="h-4 w-4" />
              Administrador
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="email">E-mail</Label>
            </div>
            <Input id="email" value={user.email || ""} disabled />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="criado">Conta criada em</Label>
            </div>
            <Input
              id="criado"
              value={
                user.created_at
                  ? new Date(user.created_at).toLocaleDateString('pt-BR')
                  : ""
              }
              disabled
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setModalOpen(true)}
          >
            Alterar senha
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 py-4">
              {error && (
                <div className="text-sm font-medium text-destructive mb-2">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={password.currentPassword}
                  onChange={(e) =>
                    setPassword({
                      ...password,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword({ ...password, newPassword: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={password.confirmPassword}
                  onChange={(e) =>
                    setPassword({
                      ...password,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  "Salvar nova senha"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
