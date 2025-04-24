
import { supabase } from '@/integrations/supabase/client';

// Type definitions used throughout the app
export type Fornecedor = {
  id: number;
  nome_loja?: string | null;
  nome?: string;
  categoria: string | null;
  Whatsapp?: string;
  Instagram_url?: string;
  Endereco?: string;
  logo_url?: string;
  foto_destaque?: string;
  mockup_url?: string;
  localizacao?: string;
  created_at: string;
};

export type Categoria = {
  id: number;
  categoria: string;
  imagem_url?: string;
  created_at: string;
};

// Mapping function to convert database types to our type definitions
export const mapFornecedor = (dbFornecedor: any): Fornecedor => ({
  id: dbFornecedor.id,
  nome_loja: dbFornecedor.nome_loja,
  nome: dbFornecedor.nome_loja, // for compatibility with code using .nome
  categoria: dbFornecedor.categoria,
  Whatsapp: dbFornecedor.Whatsapp,
  Instagram_url: dbFornecedor.Instagram_url,
  Endereco: dbFornecedor.Endereco,
  logo_url: dbFornecedor.logo_url || null,
  foto_destaque: dbFornecedor.foto_destaque || null,
  mockup_url: dbFornecedor.mockup_url || null,
  localizacao: dbFornecedor.localizacao || null,
  created_at: dbFornecedor.created_at
});

export const mapCategoria = (dbCategoria: any): Categoria => ({
  id: dbCategoria.id,
  categoria: dbCategoria.categoria,
  imagem_url: dbCategoria.imagem_url,
  created_at: dbCategoria.created_at
});

// Re-export supabase client
export { supabase };
