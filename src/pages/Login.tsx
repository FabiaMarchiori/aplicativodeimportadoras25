
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useAuth();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Form data para login
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Form data para registro
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Redirect to the page the user was trying to access, or home if none
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

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
      
      // Switch to login tab after successful registration
      setActiveTab("login");
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResettingPassword(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
        duration: 5000
      });
      
      setForgotPasswordOpen(false);
    } catch (error: any) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      setError(error.message || "Erro ao solicitar redefinição de senha");
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Determinar classes com base na guia ativa
  const containerClass = activeTab === "login" ? "login-container" : "register-container";

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 fade-in ${containerClass}`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Importadoras da 25 de Março</h1>
          <p className="text-white opacity-90">Seu diretório de fornecedores</p>
        </div>

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
            <Card className={activeTab === "login" ? "login-card border-white/20" : ""}>
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
                        onClick={() => setForgotPasswordOpen(true)}
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
          </TabsContent>
          
          <TabsContent value="register" className="mt-4">
            <Card className={activeTab === "register" ? "register-card border-white/20" : ""}>
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Esqueci minha senha */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="bg-[#5FB9C3] text-white border-white/20 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">Recuperar senha</DialogTitle>
            <DialogDescription className="text-white/80">
              Digite seu e-mail para receber um link de redefinição de senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword}>
            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reset-email" className="col-span-4 text-white">
                  E-mail
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="col-span-4 bg-white/10 text-white border-white/30 placeholder:text-white/60"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setForgotPasswordOpen(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isResettingPassword}
                className="bg-white text-[#5FB9C3] hover:bg-white/90"
              >
                {isResettingPassword ? "Enviando..." : "Enviar link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
