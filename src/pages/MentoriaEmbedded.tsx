import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SOPH_ORIGIN = "https://empreendajacomsoph.netlify.app";

export default function MentoriaEmbedded() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchToken() {
      try {
        console.log("[MentoriaEmbedded] Fetching SSO token...");

        const { data, error } = await supabase.functions.invoke("generate-soph-token");

        if (error) {
          console.error("[MentoriaEmbedded] token fetch failed", error);
          return;
        }

        if (mounted && data?.token) {
          console.log("[MentoriaEmbedded] Token recebido da edge function");
          setToken(data.token);
        } else {
          console.error("[MentoriaEmbedded] Token ausente na resposta", data);
        }
      } catch (err) {
        console.error("[MentoriaEmbedded] Erro ao buscar token", err);
      }
    }

    fetchToken();
    return () => { mounted = false };
  }, []);

  const onIframeLoad = () => {
    console.log("[MentoriaEmbedded] iframe loaded");
    setIframeLoaded(true);
  };

  useEffect(() => {
    if (!token || !iframeLoaded || !iframeRef.current?.contentWindow) {
      console.log("[MentoriaEmbedded] Waiting for token and iframe...", {
        token: !!token,
        iframeLoaded,
      });
      return;
    }

    const target = iframeRef.current.contentWindow;

    const send = () => {
      try {
        console.log("[MentoriaEmbedded] Sending SSO_TOKEN via postMessage...");
        target.postMessage(
          { type: "SSO_TOKEN", token },
          SOPH_ORIGIN
        );
      } catch (err) {
        console.error("[MentoriaEmbedded] postMessage error", err);
      }
    };

    send();
    const t1 = setTimeout(send, 500);
    const t2 = setTimeout(send, 1500);
    const done = setTimeout(() => setLoading(false), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(done);
    };
  }, [token, iframeLoaded]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0b0d17", position: "relative" }}>
      {loading && (
        <div style={{ color: "#fff", textAlign: "center", paddingTop: "40vh", position: "absolute", width: "100%", zIndex: 10 }}>
          Carregando sua mentora...
        </div>
      )}

      <button
        onClick={() => navigate("/mentoria")}
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 20,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Voltar
      </button>

      <iframe
        ref={iframeRef}
        src={`${SOPH_ORIGIN}/embedded`}
        onLoad={onIframeLoad}
        title="Soph Embedded"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        referrerPolicy="no-referrer"
        allow="clipboard-write; fullscreen"
      />
    </div>
  );
}
