import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SOPH_ORIGIN = "https://empreendaja-com-soph.netlify.app";

const MentoriaEmbedded = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
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
          console.log("[MentoriaEmbedded] Token received successfully:", data.token.substring(0, 20) + "...");
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

  // Send token via postMessage when both token and iframe are ready
  useEffect(() => {
    if (!token || !iframeLoaded) {
      console.log("[MentoriaEmbedded] Waiting for token and iframe...", { token: !!token, iframeLoaded });
      return;
    }

    if (!iframeRef.current?.contentWindow) {
      console.error("[MentoriaEmbedded] Iframe contentWindow not available");
      return;
    }

    const sendToken = () => {
      console.log("[MentoriaEmbedded] Sending token via postMessage to:", SOPH_ORIGIN);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "SSO_TOKEN", token },
        SOPH_ORIGIN
      );
    };

    // Send immediately
    sendToken();

    // Retry after 500ms and 1500ms to ensure delivery
    const retry1 = setTimeout(() => {
      console.log("[MentoriaEmbedded] Retry 1: Sending token...");
      sendToken();
    }, 500);

    const retry2 = setTimeout(() => {
      console.log("[MentoriaEmbedded] Retry 2: Sending token...");
      sendToken();
    }, 1500);

    // Hide loading after sending
    const hideLoading = setTimeout(() => {
      console.log("[MentoriaEmbedded] Hiding loading overlay");
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(retry1);
      clearTimeout(retry2);
      clearTimeout(hideLoading);
    };
  }, [token, iframeLoaded]);

  const handleIframeLoad = () => {
    console.log("[MentoriaEmbedded] Iframe onLoad fired");
    setIframeLoaded(true);
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

      {/* Back button */}
      <Button
        onClick={handleBack}
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-20 text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      {/* Iframe - render when token exists */}
      {token && (
        <iframe
          ref={iframeRef}
          src={`${SOPH_ORIGIN}/embedded`}
          onLoad={handleIframeLoad}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="clipboard-write; fullscreen"
          referrerPolicy="no-referrer"
          className="w-full h-full border-none"
        />
      )}
    </div>
  );
};

export default MentoriaEmbedded;
