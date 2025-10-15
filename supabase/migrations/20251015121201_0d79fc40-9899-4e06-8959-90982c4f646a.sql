-- Liberar acesso manual para gizelylima0@gmail.com
-- Inserir assinatura ativa de 30 dias no plano mensal R$ 27,00

INSERT INTO public.assinaturas (
  user_id,
  email,
  kiwify_subscription_id,
  plano,
  status,
  valor,
  data_inicio,
  data_expiracao,
  nome_cliente
)
VALUES (
  'c5265853-e6ba-4256-9798-2746bd704e2d',
  'gizelylima0@gmail.com',
  'MANUAL_GIZELY_' || gen_random_uuid()::text,
  'Mensal - R$ 27,00',
  'ativa',
  27.00,
  now(),
  now() + interval '30 days',
  'Gizely Lima'
)
ON CONFLICT (kiwify_subscription_id) DO NOTHING;