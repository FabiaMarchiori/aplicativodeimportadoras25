
import React from "react";
import { Fornecedor } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Instagram } from "lucide-react";

type Props = {
  fornecedor: Fornecedor;
};

const FornecedorDetalhesCard: React.FC<Props> = ({ fornecedor }) => {
  const nomeLoja = fornecedor.nome_loja || fornecedor.nome;
  const phone = fornecedor.Whatsapp || "";
  const instagram = fornecedor.Instagram_url || "";

  const handleWhatsapp = () => {
    if (phone)
      window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
  };

  const handleInstagram = () => {
    if (instagram)
      window.open(`https://instagram.com/${instagram.replace(/^@/, "")}`, "_blank");
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-2">{nomeLoja || "Sem nome"}</h3>
      </div>
      <div className="space-y-2 text-muted-foreground">
        <div>
          <span className="font-medium">Endereço: </span>
          {fornecedor.Endereco || "-"}
        </div>
        <div>
          <span className="font-medium mr-2">WhatsApp:</span>
          {fornecedor.Whatsapp ? (
            <Button size="sm" variant="outline" className="inline-flex gap-2" onClick={handleWhatsapp}>
              <Phone className="h-4 w-4" />
              {fornecedor.Whatsapp}
            </Button>
          ) : (
            "-"
          )}
        </div>
        <div>
          <span className="font-medium mr-2">Instagram:</span>
          {fornecedor.Instagram_url ? (
            <Button size="sm" variant="outline" className="inline-flex gap-2" onClick={handleInstagram}>
              <Instagram className="h-4 w-4" />
              {fornecedor.Instagram_url.startsWith("@") ? fornecedor.Instagram_url : "@" + fornecedor.Instagram_url}
            </Button>
          ) : (
            "-"
          )}
        </div>
      </div>
    </Card>
  );
};

export default FornecedorDetalhesCard;
