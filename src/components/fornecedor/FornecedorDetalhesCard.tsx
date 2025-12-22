
import React from "react";
import { Fornecedor } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, MapPin, Image as ImageIcon } from "lucide-react";

type Props = {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
};

const FornecedorDetalhesCard: React.FC<Props> = ({ fornecedor, isAdmin, onEditClick }) => {
  const generateMapsUrl = (address: string) => {
    if (!address) return "";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return "Endereço não informado";
    return address;
  };

  const getInstagramUsername = (instagramUrl: string | undefined) => {
    if (!instagramUrl) return "";
    if (instagramUrl.startsWith("@")) return instagramUrl;
    const match = instagramUrl.match(/instagram\.com\/([^/?]+)/);
    return match ? `@${match[1]}` : instagramUrl;
  };

  return (
    <div className="w-full max-w-full sm:max-w-2xl mx-auto flex flex-col items-center px-0">
      {/* Action Cards - WhatsApp, Instagram, Endereço */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
        {/* WhatsApp */}
        <Card className="group p-4 flex flex-col items-center gap-3 bg-[#0d2847]/80 backdrop-blur-sm border border-[#3CBBC7]/20 hover:border-[#3CBBC7]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#3CBBC7]/10 hover:-translate-y-1">
          <div className="p-3 rounded-full bg-[#3CBBC7]/10 transition-transform duration-300 group-hover:scale-110">
            <Phone className="h-7 w-7 text-[#3CBBC7]" />
          </div>
          <span className="text-white/80 text-sm">WhatsApp</span>
          <Button
            variant="outline"
            className="border-[#3CBBC7]/40 text-white bg-transparent hover:bg-[#3CBBC7]/20 hover:border-[#3CBBC7] w-full transition-all duration-300"
            onClick={() => window.open(`https://wa.me/${fornecedor.Whatsapp?.replace(/\D/g, "") || ""}`, "_blank")}
          >
            Abrir Conversa
          </Button>
        </Card>
        
        {/* Instagram */}
        <Card className="group p-4 flex flex-col items-center gap-3 bg-[#0d2847]/80 backdrop-blur-sm border border-[#3CBBC7]/20 hover:border-[#3CBBC7]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#3CBBC7]/10 hover:-translate-y-1">
          <div className="p-3 rounded-full bg-[#3CBBC7]/10 transition-transform duration-300 group-hover:scale-110">
            <Instagram className="h-7 w-7 text-[#3CBBC7]" />
          </div>
          <span className="text-white text-sm font-medium">
            {getInstagramUsername(fornecedor.Instagram_url)}
          </span>
          <Button
            variant="outline"
            className="border-[#3CBBC7]/40 text-white bg-transparent hover:bg-[#3CBBC7]/20 hover:border-[#3CBBC7] w-full transition-all duration-300"
            onClick={() => fornecedor.Instagram_url && window.open(fornecedor.Instagram_url, "_blank")}
            disabled={!fornecedor.Instagram_url}
          >
            Ver Página
          </Button>
        </Card>
        
        {/* Endereço */}
        <Card className="group p-4 flex flex-col items-center gap-3 bg-[#0d2847]/80 backdrop-blur-sm border border-[#3CBBC7]/20 hover:border-[#3CBBC7]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#3CBBC7]/10 hover:-translate-y-1">
          <div className="p-3 rounded-full bg-[#3CBBC7]/10 transition-transform duration-300 group-hover:scale-110">
            <MapPin className="h-7 w-7 text-[#3CBBC7]" />
          </div>
          <span className="text-white/80 text-sm text-center line-clamp-2">
            {formatAddress(fornecedor.Endereco)}
          </span>
          <Button
            variant="outline"
            className="border-[#3CBBC7]/40 text-white bg-transparent hover:bg-[#3CBBC7]/20 hover:border-[#3CBBC7] w-full transition-all duration-300"
            onClick={() => fornecedor.Endereco && window.open(generateMapsUrl(fornecedor.Endereco), "_blank")}
            disabled={!fornecedor.Endereco}
          >
            Abrir Mapa
          </Button>
        </Card>
      </div>

      {/* Instagram Embed Section */}
      <Card className="w-full max-w-full sm:max-w-md p-4 bg-[#0d2847]/80 backdrop-blur-sm border border-[#3CBBC7]/20">
        <h2 className="text-xl text-white font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <Instagram className="h-5 w-5 text-[#3CBBC7]" />
          Instagram
        </h2>
        
        {/* Phone mockup */}
        <div className="flex justify-center">
          <div className="w-full max-w-[280px] rounded-[2rem] border-4 border-white/20 bg-[#0a1628] p-2 shadow-2xl">
            {/* Phone notch */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-5 rounded-b-xl bg-black" />
            </div>
            
            {/* Screen content */}
            <div className="rounded-2xl overflow-hidden bg-white/5 aspect-[9/16]">
              {fornecedor.mockup_url ? (
                <img
                  src={fornecedor.mockup_url}
                  alt="Imagem do Instagram"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <ImageIcon className="w-12 h-12 mb-3 text-[#3CBBC7]/50" />
                  <p className="text-white/50 text-sm text-center px-4">
                    Sem imagem do Instagram
                  </p>
                </div>
              )}
            </div>
            
            {/* Phone bottom bar */}
            <div className="flex justify-center mt-3">
              <div className="w-24 h-1 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FornecedorDetalhesCard;
