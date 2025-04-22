
import React from "react";
import { Fornecedor } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, MapPin, Image as ImageIcon } from "lucide-react";
import { FornecedorContato } from "./FornecedorContato";
import { FornecedorInstagram } from "./FornecedorInstagram";

type Props = {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
};

const FornecedorDetalhesCard: React.FC<Props> = ({ fornecedor, isAdmin, onEditClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center mt-6">
      {/* Foto e upload/admin */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-28 h-28 mb-2">
          <img
            src={fornecedor.logo_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
            alt={`Logo ${fornecedor.nome_loja || fornecedor.nome}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500 shadow"
          />
          {isAdmin && (
            <Button
              size="sm"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs bg-white border border-yellow-500 text-yellow-600 shadow hover:bg-yellow-100"
              onClick={onEditClick}
            >
              <ImageIcon className="w-4 h-4 mr-1" /> Enviar Imagem
            </Button>
          )}
        </div>
        <h2 className="text-2xl font-bold font-heading text-center mb-1 text-yellow-700">{fornecedor.nome_loja || fornecedor.nome}</h2>
        <p className="text-gray-500 text-center text-sm mb-0">Utilidades domésticas para todos os ambientes</p>
      </div>

      {/* Cards de contato */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
        {/* Whatsapp */}
        <Card className="flex flex-col items-center border-2 border-yellow-500 py-4 px-3 bg-white shadow-none">
          <Phone className="h-6 w-6 mb-1 text-yellow-600" />
          <div className="font-semibold mb-1">WhatsApp</div>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-100 w-full"
            onClick={() => window.open(`https://wa.me/${fornecedor.Whatsapp?.replace(/\D/g, "") || ""}`, "_blank")}
          >
            Abrir Conversa
          </Button>
        </Card>
        {/* Instagram */}
        <Card className="flex flex-col items-center border-2 border-yellow-500 py-4 px-3 bg-white shadow-none">
          <Instagram className="h-6 w-6 mb-1 text-yellow-600" />
          <div className="font-semibold mb-1">
            {fornecedor.Instagram_url?.startsWith("@") 
              ? fornecedor.Instagram_url 
              : `@${fornecedor.Instagram_url || ""}`
            }
          </div>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-100 w-full"
            onClick={() => window.open(`https://instagram.com/${fornecedor.Instagram_url?.replace(/^@/, "") || ""}`, "_blank")}
          >
            Ver Página
          </Button>
        </Card>
        {/* Endereço / Mapa */}
        <Card className="flex flex-col items-center border-2 border-yellow-500 py-4 px-3 bg-white shadow-none">
          <MapPin className="h-6 w-6 mb-1 text-yellow-600" />
          <div className="font-semibold mb-1 text-center">
            {fornecedor.Endereco ? fornecedor.Endereco : "Endereço não cadastrado"}
          </div>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-100 w-full"
            onClick={() => fornecedor.localizacao && window.open(fornecedor.localizacao, "_blank")}
            disabled={!fornecedor.localizacao}
          >
            Abrir Mapa
          </Button>
        </Card>
      </div>

      {/* Mockup celular instagram */}
      <div className="flex flex-col items-center w-full mt-4 mb-10">
        <div className="w-[320px] h-[600px] rounded-xl border-2 border-black bg-gray-100 flex flex-col items-center justify-center shadow-lg relative">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 w-28 h-4 rounded-b-2xl bg-black/80" />
          {fornecedor.foto_destaque ? (
            <img
              src={fornecedor.foto_destaque}
              alt="Imagem do Instagram"
              className="w-[270px] h-[480px] object-cover rounded-lg mt-8"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full opacity-40 mt-8">
              <ImageIcon className="w-16 h-16 mb-2" />
              <p className="text-gray-400">Sem imagem do Instagram</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FornecedorDetalhesCard;
