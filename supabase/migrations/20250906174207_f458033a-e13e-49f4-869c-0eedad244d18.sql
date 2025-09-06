-- Ativar assinatura premium anual para Julimeire Ferreira
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
  '687d7f8e-2dc9-486b-a58a-f1397ab21c77'::uuid,
  'julimeireferreira@gmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Julimeire Ferreira'
);