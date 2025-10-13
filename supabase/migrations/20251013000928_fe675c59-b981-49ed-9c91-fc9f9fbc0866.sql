-- Adicionar política RLS para permitir usuários verem suas assinaturas por email
CREATE POLICY "Usuários podem ver assinaturas pelo email" 
ON public.assinaturas 
FOR SELECT 
USING (auth.email() = email);