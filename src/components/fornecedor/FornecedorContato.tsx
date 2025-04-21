
import { MapPin, Phone, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Fornecedor } from "@/lib/supabase";
import { formatInstagramLink, formatWhatsAppLink } from "@/utils/uploadUtils";

interface FornecedorContatoProps {
  fornecedor: Fornecedor;
}

export function FornecedorContato({ fornecedor }: FornecedorContatoProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Contato</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {fornecedor.Whatsapp && (
          <a
            href={formatWhatsAppLink(fornecedor.Whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-emerald-500/10 text-emerald-600 rounded-lg hover:bg-emerald-500/20 transition-colors"
          >
            <Phone className="h-5 w-5 mr-3" />
            <span>Conversar no WhatsApp</span>
          </a>
        )}
        
        {fornecedor.Instagram_url && (
          <a
            href={formatInstagramLink(fornecedor.Instagram_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-purple-500/10 text-purple-600 rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            <Instagram className="h-5 w-5 mr-3" />
            <span>Ver no Instagram</span>
          </a>
        )}
        
        {fornecedor.localizacao && (
          <a
            href={fornecedor.localizacao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <MapPin className="h-5 w-5 mr-3" />
            <span>Abrir no Google Maps</span>
          </a>
        )}
      </div>
    </Card>
  );
}
