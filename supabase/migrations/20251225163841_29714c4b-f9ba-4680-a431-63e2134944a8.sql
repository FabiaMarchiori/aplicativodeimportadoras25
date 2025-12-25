-- Criar tabela para códigos de acesso à Soph
CREATE TABLE public.soph_access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Criar índices para performance
CREATE INDEX idx_soph_access_codes_user_id ON public.soph_access_codes(user_id);
CREATE INDEX idx_soph_access_codes_code ON public.soph_access_codes(code);
CREATE INDEX idx_soph_access_codes_active ON public.soph_access_codes(is_active, expires_at);

-- Habilitar RLS
ALTER TABLE public.soph_access_codes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver seus próprios códigos"
ON public.soph_access_codes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role pode inserir códigos"
ON public.soph_access_codes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role pode atualizar códigos"
ON public.soph_access_codes
FOR UPDATE
USING (true);

CREATE POLICY "Admins podem ver todos os códigos"
ON public.soph_access_codes
FOR SELECT
USING (public.is_admin());