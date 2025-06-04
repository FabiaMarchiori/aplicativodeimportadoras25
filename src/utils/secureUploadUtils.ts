
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

// Allowed file types for security
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// File signature validation (magic numbers)
const FILE_SIGNATURES = {
  'image/jpeg': ['FFD8FF'],
  'image/jpg': ['FFD8FF'],
  'image/png': ['89504E47'],
  'image/webp': ['52494646']
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'O arquivo é muito grande. Tamanho máximo permitido: 5MB'
    };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de arquivo não permitido. Use apenas: JPEG, PNG ou WEBP'
    };
  }

  return { isValid: true };
};

export const validateFileSignature = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      const hex = Array.from(bytes.slice(0, 4))
        .map(b => b.toString(16).padStart(2, '0').toUpperCase())
        .join('');
      
      const expectedSignatures = FILE_SIGNATURES[file.type as keyof typeof FILE_SIGNATURES];
      const isValid = expectedSignatures?.some(sig => hex.startsWith(sig)) || false;
      resolve(isValid);
    };
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

export const secureUploadFile = async (
  file: File,
  bucketName: string,
  folderPath: string
): Promise<string | null> => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Erro no arquivo",
        description: validation.error
      });
      return null;
    }

    // Validate file signature
    const isValidSignature = await validateFileSignature(file);
    if (!isValidSignature) {
      toast({
        variant: "destructive",
        title: "Arquivo inválido",
        description: "O arquivo não corresponde ao tipo declarado"
      });
      return null;
    }

    // Generate secure filename
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${folderPath}/${timestamp}-${randomString}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
      
    return urlData?.publicUrl || null;
  } catch (error) {
    console.error('Erro no upload seguro:', error);
    toast({
      variant: "destructive",
      title: "Erro no upload",
      description: "Não foi possível fazer o upload do arquivo. Tente novamente."
    });
    return null;
  }
};
