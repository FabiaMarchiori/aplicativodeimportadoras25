import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Mail, LogOut, Lock, Settings, User, Crown } from "lucide-react";
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

  // Gerar bolhas de fundo apenas uma vez
  const bubbles = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      width: Math.random() * 120 + 60,
      height: Math.random() * 120 + 60,
      left: Math.random() * 100,
      top: Math.random() * 100,
    })), []
  );

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
      const {
        error: signInError
      } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: password.currentPassword
      });
      if (signInError) {
        throw new Error("Senha atual incorreta");
      }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061a2e] via-[#0b2a3f] to-[#0e3a52] text-white relative overflow-hidden">
      {/* Bolhas sutis de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/[0.06]"
            style={{
              width: `${bubble.width}px`,
              height: `${bubble.height}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 page-container max-w-md mx-auto fade-in pt-6 pb-20">
        {/* Header com Avatar */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <ProfileAvatar user={user} size="lg" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">Meu Perfil</h1>
          <p className="text-white/70 text-sm">{user.email}</p>
        </div>

        {/* Seção de Informações Pessoais */}
        <div className="space-y-4 mb-6">
          <ProfileInfoCard title="Informações Pessoais" icon={User} className="animate-fade-in">
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-white/70 text-sm">E-mail</Label>
                <Input id="email" value={user.email || ""} disabled className="bg-white/10 text-white border-white/20 mt-1" />
              </div>
            </div>
          </ProfileInfoCard>

          {/* Estatísticas */}
          <ProfileInfoCard 
            title="Estatísticas" 
            icon={Mail} 
            className="animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            <ProfileStats isAdmin={isAdmin} createdAt={user.created_at} />
          </ProfileInfoCard>

          {/* Seção de Configurações */}
          <ProfileInfoCard 
            title="Configurações" 
            icon={Settings}
            className="animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/assinatura')} 
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 
                           text-[#061a2e] font-semibold
                           hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]
                           hover:scale-[1.03]
                           transition-all duration-300 rounded-xl"
              >
                <Crown className="mr-2 h-4 w-4" />
                Status da Assinatura
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setModalOpen(true)} 
                className="w-full border-white/30 text-white bg-transparent
                           hover:bg-white/10 hover:border-white/50
                           hover:scale-[1.03]
                           transition-all duration-300 rounded-xl"
              >
                <Lock className="mr-2 h-4 w-4" />
                Alterar senha
              </Button>
            </div>
          </ProfileInfoCard>

          {/* Botão de Logout */}
          <Button 
            variant="destructive" 
            className="w-full bg-red-600 hover:bg-red-700 
                       border border-red-500/50 text-white 
                       rounded-xl shadow-lg
                       hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]
                       hover:scale-[1.03]
                       transition-all duration-300
                       animate-fade-in"
            style={{ animationDelay: '300ms' }}
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        </div>
      </div>

      {/* Modal de Alteração de Senha - Visual Premium */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0b2a3f]/95 backdrop-blur-xl text-white border border-white/15 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-cyan-400/20 border border-cyan-400/30">
                <Lock className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
              </div>
              Alterar senha
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4 py-4">
              {error && (
                <div className="text-sm font-medium text-red-300 bg-red-500/20 p-3 rounded-xl border border-red-400/30 animate-fade-in">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white/70 text-sm">Senha atual</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  placeholder="Digite sua senha atual"
                  value={password.currentPassword} 
                  onChange={e => setPassword({
                    ...password,
                    currentPassword: e.target.value
                  })} 
                  className="bg-white/10 text-white border-white/20 rounded-xl
                             placeholder:text-white/40
                             focus:border-cyan-400/50 focus:ring-cyan-400/20
                             focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]
                             transition-all duration-300" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white/70 text-sm">Nova senha</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="Digite a nova senha"
                  value={password.newPassword} 
                  onChange={e => setPassword({
                    ...password,
                    newPassword: e.target.value
                  })} 
                  className="bg-white/10 text-white border-white/20 rounded-xl
                             placeholder:text-white/40
                             focus:border-cyan-400/50 focus:ring-cyan-400/20
                             focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]
                             transition-all duration-300" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white/70 text-sm">Confirmar nova senha</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="Confirme a nova senha"
                  value={password.confirmPassword} 
                  onChange={e => setPassword({
                    ...password,
                    confirmPassword: e.target.value
                  })} 
                  className="bg-white/10 text-white border-white/20 rounded-xl
                             placeholder:text-white/40
                             focus:border-cyan-400/50 focus:ring-cyan-400/20
                             focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]
                             transition-all duration-300" 
                  required 
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalOpen(false)} 
                className="border-white/30 text-white bg-transparent
                           hover:bg-white/10 hover:border-white/50
                           hover:scale-[1.02]
                           transition-all duration-300 rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-gradient-to-r from-cyan-500 to-cyan-400 
                           text-[#061a2e] font-semibold rounded-xl
                           hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]
                           hover:scale-[1.02]
                           transition-all duration-300
                           disabled:opacity-70"
              >
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
