-- Ativar assinatura premium anual para palomarayanne3@gmail.com

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
  '69056ef9-f706-4de0-b2e2-ebc5a798cd3b'::uuid,
  'palomarayanne3@gmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_paloma_' || extract(epoch from now())::text,
  'Paloma Rayanne'
);