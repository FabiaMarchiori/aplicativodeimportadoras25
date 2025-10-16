-- Corrigir plano do marcio.zimmermann@hotmail.com de Anual para Mensal
UPDATE public.assinaturas
SET 
  plano = 'Mensal',
  valor = 29.70,
  data_expiracao = data_inicio + interval '30 days',
  status = 'expirada',
  updated_at = now()
WHERE email = 'marcio.zimmermann@hotmail.com'
  AND id = 'e89cba2e-6166-4681-9a61-945740f5c68a';

-- Corrigir plano do palomarayanne3@gmail.com de Anual para Mensal
UPDATE public.assinaturas
SET 
  plano = 'Mensal',
  valor = 29.70,
  data_expiracao = data_inicio + interval '30 days',
  status = 'expirada',
  updated_at = now()
WHERE email = 'palomarayanne3@gmail.com'
  AND id = 'd27ceb50-2e60-4891-b6d7-85512f95350f';