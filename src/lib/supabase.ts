
import { createClient } from '@supabase/supabase-js';

// Provide fallback values for development
// In production, these would be replaced with actual values from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para nosso banco de dados
export type Fornecedor = {
  id: number;
  created_at: string;
  nome: string;
  categoria_id: number;
  logo_url: string;
  whatsapp: string;
  instagram: string;
  endereco: string;
  localizacao: string;
  foto_destaque: string;
};

export type Categoria = {
  id: number;
  created_at: string;
  nome: string;
  imagem_url: string;
};

export type Usuario = {
  id: string;
  email: string;
  is_admin: boolean;
};
