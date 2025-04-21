
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export const uploadFornecedorImage = async (
  file: File,
  fornecedorId: string,
  field: 'logo' | 'destaque'
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `fornecedor-${fornecedorId}-${field}-${Math.random().toString().substring(2, 10)}.${fileExt}`;
    const filePath = `fornecedores/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('public')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
      
    return urlData?.publicUrl || null;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    toast({
      variant: "destructive",
      title: "Erro no upload",
      description: "Não foi possível fazer o upload da imagem. Tente novamente.",
    });
    return null;
  }
};

export const formatWhatsAppLink = (number?: string) => {
  if (!number) return '';
  const cleaned = number.replace(/\D/g, '');
  return `https://wa.me/${cleaned}`;
};

export const formatInstagramLink = (username?: string) => {
  if (!username) return '';
  const cleaned = username.replace('@', '');
  return `https://instagram.com/${cleaned}`;
};
