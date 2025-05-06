
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
  // Function to generate Google Maps URL from address
  const generateMapsUrl = (address: string) => {
    if (!address) return "";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  // Helper function to format the address for display
  const formatAddress = (address: string | undefined) => {
    if (!address) return "Endereço não informado";
    return address;
  };

  // Get only the username part if the full URL is provided
  const getInstagramUsername = (instagramUrl: string | undefined) => {
    if (!instagramUrl) return "";
    if (instagramUrl.startsWith("@")) return instagramUrl;
    
    // Extract username if it's a full URL
    const match = instagramUrl.match(/instagram\.com\/([^/?]+)/);
    return match ? `@${match[1]}` : instagramUrl;
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center mt-6">
      {/* Contact cards - WhatsApp, Instagram, Address */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
        {/* WhatsApp */}
        <Card className="p-6 flex flex-col items-center gap-3 bg-[#3CBBC7] border-none">
          <Phone className="h-8 w-8 text-white" />
          <Button
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white/20 w-full hover:text-white"
            onClick={() => window.open(`https://wa.me/${fornecedor.Whatsapp?.replace(/\D/g, "") || ""}`, "_blank")}
          >
            Abrir Conversa
          </Button>
        </Card>
        
        {/* Instagram */}
        <Card className="p-6 flex flex-col items-center gap-3 bg-[#3CBBC7] border-none">
          <Instagram className="h-8 w-8 text-white" />
          <p className="text-center font-medium text-sm text-white">
            {getInstagramUsername(fornecedor.Instagram_url)}
          </p>
          <Button
            variant="outline"
            className="border-white text-white bg-transparent hover:bg-white/20 w-full hover:text-white"
            onClick={() => fornecedor.Instagram_url && window.open(fornecedor.Instagram_url, "_blank")}
            disabled={!fornecedor.Instagram_url}
          >
            Ver Página
          </Button>
        </Card>
        
        {/* Endereço / Mapa */}
        <Card className="p-6 flex flex-col items-center gap-3 bg-[#3CBBC7] border-none">
          <MapPin className="h-8 w-8 text-white" />
          <p className="text-center text-sm text-white">
            {formatAddress(fornecedor.Endereco)}
          </p>
          <Button
            variant="outline" 
            className="border-white text-white bg-transparent hover:bg-white/20 w-full hover:text-white"
            onClick={() => fornecedor.Endereco && window.open(generateMapsUrl(fornecedor.Endereco), "_blank")}
            disabled={!fornecedor.Endereco}
          >
            Abrir Mapa
          </Button>
        </Card>
      </div>

      {/* Mockup celular com a imagem do Instagram */}
      <div className="flex flex-col items-center w-full mt-4 mb-10">
        <h2 className="text-xl text-[#322523] font-medium mb-4">Instagram</h2>
        <div className="w-[320px] h-[600px] rounded-xl border-4 border-[#3CBBC7] relative overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 w-28 h-4 rounded-b-2xl bg-black/80 z-10" />
          <div className="w-full h-full">
            {fornecedor.mockup_url ? (
              <img
                src={fornecedor.mockup_url}
                alt="Imagem do Instagram"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full opacity-40">
                <ImageIcon className="w-16 h-16 mb-2 text-[#3CBBC7]" />
                <p className="text-[#322523]">Sem imagem do Instagram</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FornecedorDetalhesCard;
