import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MentoriaEmbedded = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log("[MentoriaEmbedded] Fetching SSO token...");
        
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setError("Sessão não encontrada. Faça login novamente.");
          setLoading(false);
          return;
        }

        const { data, error: fnError } = await supabase.functions.invoke("generate-soph-token");

        if (fnError) {
          console.error("[MentoriaEmbedded] Error fetching token:", fnError);
          setError("Erro ao gerar token de acesso.");
          setLoading(false);
          return;
        }

        if (data?.token) {
          console.log("[MentoriaEmbedded] Token received successfully");
          setToken(data.token);
        } else if (data?.error) {
          console.error("[MentoriaEmbedded] API error:", data.error);
          if (data.error === "Active subscription required") {
            setError("Assinatura ativa necessária para acessar a Soph.");
          } else {
            setError(data.error);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("[MentoriaEmbedded] Unexpected error:", err);
        setError("Erro inesperado ao carregar a mentoria.");
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Send token to iframe via postMessage when iframe loads
  const handleIframeLoad = () => {
    if (token && iframeRef.current?.contentWindow) {
      console.log("[MentoriaEmbedded] Sending token via postMessage...");
      iframeRef.current.contentWindow.postMessage(
        {
          type: "SSO_TOKEN",
          token,
        },
        "https://empreendaja-com-soph.netlify.app"
      );
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/mentoria");
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-4">
        <p className="text-lg mb-4 text-center">{error}</p>
        <Button onClick={handleBack} variant="outline" className="text-white border-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
          <p className="text-white text-sm">Carregando Soph...</p>
        </div>
      )}

      {/* Back button - always visible */}
      <Button
        onClick={handleBack}
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-20 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Iframe - only render when we have a token */}
      {token && (
        <iframe
          ref={iframeRef}
          src="https://empreendaja-com-soph.netlify.app/embedded"
          onLoad={handleIframeLoad}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
          allow="clipboard-write; fullscreen"
          className="w-full h-full border-0"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default MentoriaEmbedded;
