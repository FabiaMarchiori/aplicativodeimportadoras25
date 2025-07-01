
-- Criar enum para status das assinaturas
CREATE TYPE public.subscription_status AS ENUM (
  'ativa',
  'inativa', 
  'cancelada',
  'expirada',
  'reembolsada'
);

-- Criar tabela de assinaturas
CREATE TABLE public.assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kiwify_subscription_id TEXT UNIQUE NOT NULL,
  kiwify_customer_id TEXT,
  email TEXT NOT NULL,
  nome_cliente TEXT,
  status subscription_status NOT NULL DEFAULT 'ativa',
  plano TEXT NOT NULL,
  valor DECIMAL(10,2),
  data_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_expiracao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_assinaturas_user_id ON public.assinaturas(user_id);
CREATE INDEX idx_assinaturas_email ON public.assinaturas(email);
CREATE INDEX idx_assinaturas_kiwify_id ON public.assinaturas(kiwify_subscription_id);
CREATE INDEX idx_assinaturas_status ON public.assinaturas(status);

-- Criar tabela de logs de webhooks para auditoria
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL, -- 'success', 'error', 'processed'
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS nas tabelas
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies para assinaturas
CREATE POLICY "Usuários podem ver suas próprias assinaturas"
  ON public.assinaturas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as assinaturas"
  ON public.assinaturas FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins podem gerenciar assinaturas"
  ON public.assinaturas FOR ALL
  USING (is_admin());

-- RLS policies para webhook logs
CREATE POLICY "Apenas admins podem ver logs de webhook"
  ON public.webhook_logs FOR ALL
  USING (is_admin());

-- Função para verificar se usuário tem assinatura ativa
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.assinaturas 
    WHERE user_id = user_uuid 
    AND status = 'ativa' 
    AND (data_expiracao IS NULL OR data_expiracao > now())
  );
$$;

-- Função para buscar ou criar usuário por email
CREATE OR REPLACE FUNCTION public.get_or_create_user_by_email(email_param TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
  temp_password TEXT;
BEGIN
  -- Tentar encontrar usuário existente
  SELECT au.id INTO user_uuid
  FROM auth.users au
  WHERE au.email = email_param;
  
  -- Se não existir, criar novo usuário
  IF user_uuid IS NULL THEN
    -- Gerar senha temporária
    temp_password := encode(gen_random_bytes(12), 'base64');
    
    -- Inserir usuário diretamente na tabela auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      email_param,
      crypt(temp_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO user_uuid;
    
    -- Criar perfil para o usuário
    INSERT INTO public.profiles (id, email)
    VALUES (user_uuid, email_param);
  END IF;
  
  RETURN user_uuid;
END;
$$;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_assinaturas_updated_at
  BEFORE UPDATE ON public.assinaturas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
