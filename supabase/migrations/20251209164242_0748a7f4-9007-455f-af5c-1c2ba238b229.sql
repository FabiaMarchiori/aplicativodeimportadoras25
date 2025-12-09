-- AUDITORIA DE SEGURANÇA: Correções de RLS

-- 1. Remover políticas duplicadas/permissivas demais na tabela categorias
DROP POLICY IF EXISTS "Anyone can view categorias" ON public.categorias;

-- 2. Remover políticas duplicadas/permissivas demais na tabela fornecedores
DROP POLICY IF EXISTS "Anyone can view fornecedores" ON public.fornecedores;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.fornecedores;

-- 3. Corrigir política service_role sem USING condition em clientes_autorizados
DROP POLICY IF EXISTS "Enable full access for service_role" ON public.clientes_autorizados;

-- Criar política correta para service_role (só via backend/edge functions)
CREATE POLICY "Service role full access clientes_autorizados"
ON public.clientes_autorizados
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Adicionar política INSERT explícita para assinaturas (somente admins/service)
CREATE POLICY "Apenas admins podem criar assinaturas"
ON public.assinaturas
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- 5. Adicionar política UPDATE explícita para assinaturas (somente admins)
CREATE POLICY "Apenas admins podem atualizar assinaturas"
ON public.assinaturas
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Adicionar política DELETE explícita para assinaturas (somente admins)
CREATE POLICY "Apenas admins podem deletar assinaturas"
ON public.assinaturas
FOR DELETE
TO authenticated
USING (is_admin());

-- 7. Corrigir funções com search_path mutável
CREATE OR REPLACE FUNCTION public.get_distinct_fornecedores()
RETURNS TABLE(id bigint, nome_loja text, categoria text, "Whatsapp" text, "Instagram_url" text, "Endereco" text, logo_url text, mockup_url text, created_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
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

-- 8. Corrigir função update_updated_at_column com search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 9. Adicionar política INSERT para webhook_logs (somente service_role pode inserir)
CREATE POLICY "Service role pode inserir logs de webhook"
ON public.webhook_logs
FOR INSERT
TO service_role
WITH CHECK (true);