
import React from "react";
import { Fornecedor } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, MapPin } from "lucide-react";
import { FornecedorContato } from "./FornecedorContato";
import { FornecedorInstagram } from "./FornecedorInstagram";

type Props = {
  fornecedor: Fornecedor;
  isAdmin: boolean;
  onEditClick: () => void;
};

const FornecedorDetalhesCard: React.FC<Props> = ({ fornecedor, isAdmin, onEditClick }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6 h-full">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-3">{fornecedor.nome_loja || fornecedor.nome || "Sem nome"}</h3>
              {fornecedor.Endereco && (
                <div className="flex items-start text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{fornecedor.Endereco}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {fornecedor.Whatsapp && (
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white flex gap-2"
                  onClick={() => window.open(`https://wa.me/${fornecedor.Whatsapp.replace(/\D/g, "")}`, "_blank")}
                >
                  <Phone className="h-5 w-5" />
                  Entrar em contato
                </Button>
              )}
              
              {fornecedor.Instagram_url && (
                <Button 
                  className="bg-purple-500 hover:bg-purple-600 text-white flex gap-2"
                  onClick={() => window.open(`https://instagram.com/${fornecedor.Instagram_url.replace(/^@/, "")}`, "_blank")}
                >
                  <Instagram className="h-5 w-5" />
                  Ver Instagram
                </Button>
              )}
              
              {fornecedor.localizacao && (
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white sm:col-span-2 flex gap-2"
                  onClick={() => window.open(fornecedor.localizacao || "", "_blank")}
                >
                  <MapPin className="h-5 w-5" />
                  Ver no mapa
                </Button>
              )}
            </div>
          </Card>
        </div>
        
        <div>
          <FornecedorInstagram fornecedor={fornecedor} />
        </div>
      </div>
      
      <FornecedorContato fornecedor={fornecedor} />
    </div>
  );
};

export default FornecedorDetalhesCard;
