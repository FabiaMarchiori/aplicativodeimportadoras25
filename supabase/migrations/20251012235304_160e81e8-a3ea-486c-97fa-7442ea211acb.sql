-- Liberar acesso mensal para kamillafigueiredo06@gmail.com
INSERT INTO public.assinaturas (
  user_id,
  email,
  plano,
  valor,
  status,
  data_inicio,
  data_expiracao,
  kiwify_subscription_id,
  nome_cliente
)
VALUES (
  'd9ff9157-7742-4f00-b74e-00c6fa97bc78',
  'kamillafigueiredo06@gmail.com',
  'mensal',
  27.00,
  'ativa',
  '2025-10-12 00:00:00+00',
  '2025-11-12 23:59:59+00',
  'MANUAL_ADMIN_20251012_kamilla',
  'Kamilla Figueiredo'
);