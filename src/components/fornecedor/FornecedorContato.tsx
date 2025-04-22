
import { MapPin, Phone, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Fornecedor } from "@/lib/supabase";

interface FornecedorContatoProps {
  fornecedor: Fornecedor;
}

export function FornecedorContato({ fornecedor }: FornecedorContatoProps) {
  const formatWhatsAppLink = (whatsapp: string) => {
    const cleanPhone = whatsapp.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}`;
  };

  const formatInstagramLink = (instagram: string) => {
    const cleanHandle = instagram.replace(/^@/, "");
    return `https://instagram.com/${cleanHandle}`;
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Contato</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fornecedor.Whatsapp && (
          <a
            href={formatWhatsAppLink(fornecedor.Whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-emerald-500/10 text-yellow-600 border-2 border-yellow-500 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Phone className="h-6 w-6 mr-3" />
            <div>
              <div className="font-medium">WhatsApp</div>
              <div className="text-sm text-emerald-600/80">{fornecedor.Whatsapp}</div>
            </div>
          </a>
        )}
        
        {fornecedor.Instagram_url && (
          <a
            href={formatInstagramLink(fornecedor.Instagram_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-purple-500/10 text-yellow-600 border-2 border-yellow-500 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Instagram className="h-6 w-6 mr-3" />
            <div>
              <div className="font-medium">Instagram</div>
              <div className="text-sm text-purple-600/80">
                {fornecedor.Instagram_url.startsWith("@") 
                  ? fornecedor.Instagram_url 
                  : "@" + fornecedor.Instagram_url}
              </div>
            </div>
          </a>
        )}
        
        {fornecedor.localizacao && (
          <a
            href={fornecedor.localizacao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-red-500/10 text-yellow-600 border-2 border-yellow-500 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <MapPin className="h-6 w-6 mr-3" />
            <div>
              <div className="font-medium">Localização</div>
              <div className="text-sm text-red-600/80">Abrir no Google Maps</div>
            </div>
          </a>
        )}
      </div>
    </Card>
  );
}

