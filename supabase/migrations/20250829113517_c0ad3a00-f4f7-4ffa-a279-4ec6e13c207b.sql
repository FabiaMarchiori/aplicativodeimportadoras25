-- Ativar assinatura premium anual para Marcio Zimmermann
INSERT INTO public.assinaturas (
  user_id,
  email,
  status,
  plano,
  valor,
  data_inicio,
  data_expiracao,
  kiwify_subscription_id,
  nome_cliente
) VALUES (
  '84e5b7f0-7848-426c-8063-3f684e49350f'::uuid,
  'marcio.zimmermann@hotmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Marcio Zimmermann'
);