
-- Primeiro, vamos remover a trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recriar a função handle_new_user com melhor tratamento de erros
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro para debug
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new; -- Retorna new mesmo com erro para não bloquear o signup
END;
$function$;

-- Recriar a trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
