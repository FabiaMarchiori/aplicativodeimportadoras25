
import { createClient } from '@supabase/supabase-js';

// Estas URLs são preenchidas automaticamente quando o projeto é conectado ao Supabase via Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
