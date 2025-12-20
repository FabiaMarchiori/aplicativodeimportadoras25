import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type GoogleAuthButtonProps = {
  mode: "login" | "signup";
};

export function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const redirectTo = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error("Erro na autenticação Google:", error);
        let errorMessage = "Não foi possível fazer login com Google";
        
        if (error.message.includes('redirect')) {
          errorMessage = "Erro de redirecionamento. Verifique as configurações de URL no Supabase.";
        } else if (error.message.includes('popup')) {
          errorMessage = "Popup bloqueado. Permita popups para este site e tente novamente.";
        } else if (error.message.includes('cors')) {
          errorMessage = "Erro de CORS. Verifique as configurações de domínio.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro no login com Google",
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error("Erro inesperado na autenticação Google:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full bg-white text-gray-700 border-white/20 
                 hover:bg-gray-50 hover:scale-[1.02]
                 h-12 font-medium rounded-xl
                 transition-all duration-300 
                 shadow-lg hover:shadow-xl"
      onClick={handleGoogleAuth}
      disabled={isLoading}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? "Conectando..." : `${mode === "login" ? "Entrar" : "Cadastrar"} com Google`}
    </Button>
  );
}
