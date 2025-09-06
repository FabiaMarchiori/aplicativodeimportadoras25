-- Ativar assinaturas premium anuais para os 6 usuários sem acesso

-- 1. asueliporto@gmail.com
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
  'c53dad78-de05-4621-b00d-3400f24c654d'::uuid,
  'asueliporto@gmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Asueli Porto'
);

-- 2. ftlyuri@gmail.com
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
  'c16b57ca-a0a9-4d13-8a2c-b3c0bf8d0932'::uuid,
  'ftlyuri@gmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Yuri'
);

-- 3. manoelmoacyradm@gmail.com
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
  'c38d1d4f-21ac-4d86-8d00-4b12363521e1'::uuid,
  'manoelmoacyradm@gmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Manoel Moacyr'
);

-- 4. ateliermariaarteira.sublima@gmail.com
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
  'd240b615-abbf-49c3-955c-f3d9826c8724'::uuid,
  'ateliermariaarteira.sublima@gmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Maria Arteira'
);

-- 5. tarcilasiqueira@hotmail.com
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
  'd3d487e4-3976-4b37-80b0-929e5c90ce29'::uuid,
  'tarcilasiqueira@hotmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Tarcila Siqueira'
);

-- 6. camiladallegrave@hotmail.com
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
  '6a8c93ef-072b-4273-b503-89d01cab107a'::uuid,
  'camiladallegrave@hotmail.com',
  'ativa'::subscription_status,
  'Premium Anual',
  297.00,
  now(),
  now() + interval '1 year',
  'manual_activation_' || extract(epoch from now())::text,
  'Camila Dallegrave'
);