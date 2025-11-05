-- Criar assinatura manual para kmilakg81@gmail.com (Plano Mensal - R$ 27,00)
INSERT INTO public.assinaturas (
  email,
  kiwify_subscription_id,
  plano,
  valor,
  status,
  data_inicio,
  data_expiracao,
  user_id,
  nome_cliente
) VALUES (
  'kmilakg81@gmail.com',
  'manual_' || extract(epoch from now())::text,
  'Mensal',
  27.00,
  'ativa',
  now(),
  now() + interval '30 days',
  '2d2c734a-3a70-4705-a8b8-2d225e08e30e',
  'Camila'
);