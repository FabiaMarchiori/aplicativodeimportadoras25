-- Remover a policy atual que permite acesso a qualquer usuário autenticado
DROP POLICY IF EXISTS "Allow authenticated users to view fornecedores" ON public.fornecedores;

-- Criar nova policy que exige assinatura ativa OU ser admin
CREATE POLICY "Users with active subscription can view fornecedores" 
ON public.fornecedores 
FOR SELECT 
USING (
  is_admin() OR has_active_subscription(auth.uid())
);