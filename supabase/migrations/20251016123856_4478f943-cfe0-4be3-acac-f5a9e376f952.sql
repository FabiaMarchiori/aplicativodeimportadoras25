-- 1. Corrigir marcio.zimmermann@hotmail.com (valor incorreto)
UPDATE public.assinaturas
SET 
  valor = 27.00,
  plano = 'Mensal',
  updated_at = now()
WHERE id = 'e89cba2e-6166-4681-9a61-945740f5c68a';

-- 2. Corrigir palomarayanne3@gmail.com (valor incorreto)
UPDATE public.assinaturas
SET 
  valor = 27.00,
  plano = 'Mensal',
  updated_at = now()
WHERE id = 'd27ceb50-2e60-4891-b6d7-85512f95350f';

-- 3. Corrigir julimeireferreira@gmail.com (valor anual incorreto)
UPDATE public.assinaturas
SET 
  valor = 147.00,
  plano = 'Anual',
  updated_at = now()
WHERE id = '344bf74f-7f5a-4f65-aed5-7ad69b1344ae';

-- 4. Atualizar naty_pg@hotmail.com para plano Anual
UPDATE public.assinaturas
SET 
  plano = 'Anual',
  valor = 147.00,
  data_expiracao = '2026-08-25 16:57:11.275977+00',
  updated_at = now()
WHERE id = 'd192c44a-fef7-43c2-bfa9-db32af035b1f';

-- 5. Padronizar nomenclatura dos planos mensais
UPDATE public.assinaturas
SET 
  plano = 'Mensal',
  updated_at = now()
WHERE plano IN ('mensal', 'Mensal - R$ 27,00')
  AND valor = 27.00;

-- 6. Deletar registro de teste
DELETE FROM public.assinaturas
WHERE id = 'b012b461-ffa9-4dec-9b72-d15055d44d53';