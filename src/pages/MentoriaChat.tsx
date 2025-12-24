import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SOPH_URL = "https://empreendajacomsoph.netlify.app/";

const MentoriaChat = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 w-screen h-screen bg-background">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        onClick={() => navigate("/mentoria")}
        className="absolute top-4 left-4 z-20 bg-background/80 backdrop-blur-sm border border-border"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      {/* Iframe da Soph */}
      <iframe
        src={SOPH_URL}
        title="Mentoria com Soph"
        className="w-full h-full border-none"
        allow="clipboard-write; microphone"
      />
    </div>
  );
};

export default MentoriaChat;
