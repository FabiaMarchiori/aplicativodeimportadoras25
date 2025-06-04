
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { secureUploadFile } from "./secureUploadUtils";

export const uploadFornecedorImage = async (
  file: File,
  fornecedorId: string,
  field: 'logo' | 'destaque'
): Promise<string | null> => {
  return await secureUploadFile(
    file, 
    'fornecedor-images', 
    `${field}s`
  );
};

export const formatWhatsAppLink = (number?: string) => {
  if (!number) return '';
  // Sanitize the input to prevent XSS
  const cleaned = number.replace(/[^\d+]/g, '');
  return `https://wa.me/${cleaned}`;
};

export const formatInstagramLink = (username?: string) => {
  if (!username) return '';
  // Sanitize the input to prevent XSS
  const cleaned = username.replace(/[^a-zA-Z0-9._]/g, '').replace('@', '');
  return `https://instagram.com/${cleaned}`;
};
