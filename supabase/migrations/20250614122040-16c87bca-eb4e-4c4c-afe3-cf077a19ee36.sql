
-- Corrigir função RPC com apenas as colunas que existem na tabela
CREATE OR REPLACE FUNCTION public.get_distinct_fornecedores()
RETURNS TABLE (
  id bigint,
  nome_loja text,
  categoria text,
  "Whatsapp" text,
  "Instagram_url" text,
  "Endereco" text,
  logo_url text,
  mockup_url text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT ON (nome_loja) 
    f.id,
    f.nome_loja,
    f.categoria,
    f."Whatsapp",
    f."Instagram_url",
    f."Endereco",
    f.logo_url,
    f.mockup_url,
    f.created_at
  FROM public.fornecedores f
  WHERE f.nome_loja IS NOT NULL
  ORDER BY f.nome_loja, f.id;
$$;
