
-- Corrigir a função handle_new_user para funcionar com a tabela profiles existente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  PERFORM set_config('search_path', '', true);
  
  -- Inserir na tabela profiles (que já existe)
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  
  -- Verificar se é o e-mail do admin e configurar papel de admin
  IF new.email = 'admin@admin.com' THEN
    UPDATE public.profiles SET is_admin = true WHERE id = new.id;
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'user');
  END IF;
  
  RETURN new;
END;
$function$;
