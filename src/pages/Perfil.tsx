import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Mail, LogOut, Lock, Settings, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import ProfileStats from "@/components/profile/ProfileStats";
export default function Perfil() {
  const {
    user,
    profile,
    signOut,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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
      const {
        error: signInError
      } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: password.currentPassword
      });
      if (signInError) {
        throw new Error("Senha atual incorreta");
      }

      // Agora atualize a senha
      const {
        error: updateError
      } = await supabase.auth.updateUser({
        password: password.newPassword
      });
      if (updateError) throw updateError;
      toast({
        title: "Senha alterada com sucesso",
        description: "Sua senha foi atualizada com sucesso"
      });
      setModalOpen(false);
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      setError(error.message || "Erro ao alterar a senha");
    } finally {
      setIsLoading(false);
    }
  };
  if (!user) {
    return <div className="page-container">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para acessar esta página.
          </p>
          <Button onClick={() => navigate("/login")}>Fazer Login</Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-[#1981A7] via-[#4A9DB8] to-[#5FB9C3] text-white relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F9C820]/10 rounded-full blur-3xl animate-float-medium"></div>
      </div>

      <div className="relative z-10 page-container max-w-md mx-auto fade-in pt-6 pb-20">
        {/* Header com Avatar */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="flex justify-center mb-4">
            <ProfileAvatar user={user} size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Meu Perfil</h1>
          <p className="text-white/80 text-sm">{user.email}</p>
        </div>

        {/* Seção de Informações Pessoais */}
        <div className="space-y-4 mb-6">
          <ProfileInfoCard title="Informações Pessoais" icon={User}>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-white/80 text-sm">E-mail</Label>
                <Input id="email" value={user.email || ""} disabled className="bg-white/10 text-white border-white/20 mt-1" />
              </div>
            </div>
          </ProfileInfoCard>

          {/* Estatísticas */}
          <ProfileInfoCard title="Estatísticas" icon={Mail}>
            <ProfileStats isAdmin={isAdmin} createdAt={user.created_at} />
          </ProfileInfoCard>

          {/* Seção de Configurações */}
          <ProfileInfoCard title="Configurações" icon={Settings}>
            <div className="space-y-3">
              <Button variant="outline" onClick={() => setModalOpen(true)} className="w-full border-white/30 text-white hover:border-white/50 transition-all duration-200 bg-amber-500 hover:bg-amber-400">
                <Lock className="mr-2 h-4 w-4" />
                Alterar senha
              </Button>
            </div>
          </ProfileInfoCard>

          {/* Botão de Logout */}
          <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 border border-red-500 text-white transition-all duration-200 animate-fade-in" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        </div>
      </div>

      {/* Modal de Alteração de Senha */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-gradient-to-br from-[#1981A7] to-[#4A9DB8] text-white border-white/20 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#F9C820]" />
              Alterar senha
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 py-4">
              {error && <div className="text-sm font-medium text-red-300 bg-red-500/20 p-3 rounded-lg border border-red-400/30">
                  {error}
                </div>}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white">Senha atual</Label>
                <Input id="current-password" type="password" value={password.currentPassword} onChange={e => setPassword({
                ...password,
                currentPassword: e.target.value
              })} className="bg-white/10 text-white border-white/20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">Nova senha</Label>
                <Input id="new-password" type="password" value={password.newPassword} onChange={e => setPassword({
                ...password,
                newPassword: e.target.value
              })} className="bg-white/10 text-white border-white/20" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirmar nova senha</Label>
                <Input id="confirm-password" type="password" value={password.confirmPassword} onChange={e => setPassword({
                ...password,
                confirmPassword: e.target.value
              })} className="bg-white/10 text-white border-white/20" required />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="border-white/30 text-white hover:bg-white/10">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-[#F9C820] hover:bg-[#F9C820]/90 text-[#1981A7] font-medium">
                {isLoading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </> : "Salvar nova senha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>;
}