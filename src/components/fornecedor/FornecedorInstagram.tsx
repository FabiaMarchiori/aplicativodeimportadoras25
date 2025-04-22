
import { Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Fornecedor } from "@/lib/supabase";

interface FornecedorInstagramProps {
  fornecedor: Fornecedor;
}

export function FornecedorInstagram({ fornecedor }: FornecedorInstagramProps) {
  const formatInstagramLink = (instagram: string) => {
    const cleanHandle = instagram.replace(/^@/, "");
    return `https://instagram.com/${cleanHandle}`;
  };

  return (
    <Card className="overflow-hidden h-full">
      {fornecedor.Instagram_url ? (
        <div className="relative h-full flex flex-col">
          {/* Mockup do celular */}
          <div className="bg-black pt-5 px-3 rounded-t-lg">
            <div className="bg-black rounded-t-lg overflow-hidden relative">
              <div className="h-6 w-40 mx-auto bg-black border-b border-gray-700 flex items-center justify-center">
                <div className="w-16 h-1.5 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Conteúdo do Instagram */}
          <div className="bg-white flex-1 flex flex-col">
            {/* Header */}
            <div className="p-3 border-b flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-2">
                {fornecedor.logo_url ? (
                  <img
                    src={fornecedor.logo_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  {fornecedor.Instagram_url.startsWith("@") 
                    ? fornecedor.Instagram_url 
                    : "@" + fornecedor.Instagram_url}
                </p>
              </div>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            
            {/* Image */}
            <div className="flex-1 bg-gray-100">
              <img
                src={fornecedor.foto_destaque || "https://source.unsplash.com/random/600x600/?shop"}
                alt="Instagram post"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Actions */}
            <div className="p-3 border-t">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon>
                </svg>
              </div>
              <p className="text-sm font-semibold">{fornecedor.nome_loja || fornecedor.nome}</p>
              <a 
                href={formatInstagramLink(fornecedor.Instagram_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-600 block mt-1 hover:underline"
              >
                Ver perfil no Instagram
              </a>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="bg-black py-1 px-3 flex justify-center rounded-b-lg">
            <div className="w-32 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 h-full">
          <Instagram className="h-12 w-12 text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground text-center">
            Perfil do Instagram não configurado
          </p>
        </div>
      )}
    </Card>
  );
}
