-- 1. Garantir que a função is_admin() existe nas migrations
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM set_config('search_path', '', true);
  RETURN auth.role() = 'authenticated'
      AND auth.uid() IN (
        SELECT id FROM public.profiles WHERE is_admin = true
      );
END;
$$;

-- 2. Remover a política insegura que permite consulta por email
DROP POLICY IF EXISTS "Usuários podem ver assinaturas pelo email" ON public.assinaturas;

-- 3. Garantir que a política segura por user_id existe
DROP POLICY IF EXISTS "Usuários podem ver suas próprias assinaturas" ON public.assinaturas;

CREATE POLICY "Usuários podem ver suas próprias assinaturas"
ON public.assinaturas
FOR SELECT
USING (auth.uid() = user_id);