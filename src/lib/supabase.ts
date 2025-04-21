
import { supabase } from '@/integrations/supabase/client';

// Type definitions used throughout the app
export type Fornecedor = {
  id: number;
  nome: string;
  categoria_id: number;
  Whatsapp?: string;
  Instagram_url?: string;
  Endereco?: string;
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

// Mapping function to convert database types to our type definitions
export const mapFornecedor = (dbFornecedor: any): Fornecedor => ({
  id: dbFornecedor.id,
  nome: dbFornecedor.nome_loja || '',
  categoria_id: dbFornecedor.categoria_id || 0,
  Whatsapp: dbFornecedor.Whatsapp,
  Instagram_url: dbFornecedor.Instagram_url,
  Endereco: dbFornecedor.Endereco,
  logo_url: dbFornecedor.logo_url,
  foto_destaque: dbFornecedor.foto_destaque,
  localizacao: dbFornecedor.localizacao,
  created_at: dbFornecedor.created_at
});

export const mapCategoria = (dbCategoria: any): Categoria => ({
  id: dbCategoria.id,
  nome: dbCategoria.nome,
  imagem_url: dbCategoria.imagem_url,
  created_at: dbCategoria.created_at
});

// Re-export supabase client
export { supabase };
