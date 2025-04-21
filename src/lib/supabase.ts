import { supabase } from '@/integrations/supabase/client';

// Re-export supabase client
export { supabase };

// Type definitions used throughout the app
export type Fornecedor = {
  id: number;
  nome: string;
  categoria_id: number;
  whatsapp?: string;
  instagram?: string;
  endereco?: string;
  logo_url?: string;
  foto_destaque?: string;
  localizacao?: string;
  created_at: string;
};

export type Categoria = {
  id: number;
  nome: string;
  imagem_url?: string;
  created_at: string;
};

// Other types and utilities as needed
