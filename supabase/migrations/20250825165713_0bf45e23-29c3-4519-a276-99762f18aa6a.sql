-- Ativar assinatura para naty_pg@hotmail.com
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
  '5610a5bf-0dfa-4ca6-a6a2-9943b75724c4',
  'naty_pg@hotmail.com',
  'ativa',
  'Premium',
  0.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Natália'
);