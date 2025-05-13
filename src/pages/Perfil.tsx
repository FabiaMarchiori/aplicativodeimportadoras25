import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="min-h-screen bg-[#1981A7] text-white">
      <div className="page-container max-w-md mx-auto fade-in pt-6">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        </header>

        <Card className="mb-6 bg-[#1981A7] border-white/10">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-white">{user.email}</CardTitle>
            {isAdmin && (
              <CardDescription className="flex items-center justify-center gap-1 mt-1 text-white">
                <ShieldAlert className="h-4 w-4" />
                Administrador
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="email" className="text-white">E-mail</Label>
              </div>
              <Input id="email" value={user.email || ""} disabled className="bg-white/10 text-white border-white/20" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="criado" className="text-white">Conta criada em</Label>
              </div>
              <Input
                id="criado"
                value={
                  user.created_at
                    ? new Date(user.created_at).toLocaleDateString('pt-BR')
                    : ""
                }
                disabled
                className="bg-white/10 text-white border-white/20"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full border-white text-white hover:bg-white/10"
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
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#1981A7] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Alterar senha</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 py-4">
              {error && (
                <div className="text-sm font-medium text-red-400 mb-2">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white">Senha atual</Label>
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
                  className="bg-white/10 text-white border-white/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">Nova senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword({ ...password, newPassword: e.target.value })
                  }
                  className="bg-white/10 text-white border-white/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirmar nova senha</Label>
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
                  className="bg-white/10 text-white border-white/20"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="border-white text-white hover:bg-white/10">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-white text-[#1981A7] hover:bg-white/90">
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
