-- Criar assinatura manual para jessycacostakd@gmail.com (Plano Anual - R$ 147,00)
INSERT INTO public.assinaturas (
  email,
  plano,
  valor,
  status,
  kiwify_subscription_id,
  nome_cliente,
  data_inicio,
  data_expiracao,
  user_id
) VALUES (
  'jessycacostakd@gmail.com',
  'Anual',
  147.00,
  'ativa',
  'manual_jessyca_' || extract(epoch from now())::text,
  'Jessyca Costa',
  now(),
  now() + interval '1 year',
  NULL
);