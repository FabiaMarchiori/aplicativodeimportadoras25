
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fornecedor } from "@/lib/supabase";
import { formatInstagramLink } from "@/utils/uploadUtils";

interface FornecedorInstagramProps {
  fornecedor: Fornecedor;
}

export function FornecedorInstagram({ fornecedor }: FornecedorInstagramProps) {
  return (
    <Card className="p-6 h-fit">
      <h3 className="font-semibold text-lg mb-4">Instagram</h3>
      
      {fornecedor.Instagram_url ? (
        <div className="relative overflow-hidden rounded-lg border border-border bg-card">
          <div className="p-3 border-b border-border flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted mr-2">
              <img
                src={fornecedor.logo_url || "https://source.unsplash.com/random/100x100/?logo"}
                alt="Instagram Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium">@{fornecedor.Instagram_url}</span>
          </div>
          <div className="aspect-square bg-muted">
            <img
              src={fornecedor.foto_destaque || "https://source.unsplash.com/random/600x600/?shop"}
              alt="Instagram Post"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <div className="flex items-center gap-4 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <p className="text-sm font-medium">{fornecedor.nome}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ver mais no Instagram
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Instagram className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Instagram não disponível</p>
        </div>
      )}
      
      {fornecedor.Instagram_url && (
        <div className="mt-4">
          <Button asChild variant="outline" className="w-full">
            <a href={formatInstagramLink(fornecedor.Instagram_url)} target="_blank" rel="noopener noreferrer">
              Ver perfil completo
            </a>
          </Button>
        </div>
      )}
    </Card>
  );
}
