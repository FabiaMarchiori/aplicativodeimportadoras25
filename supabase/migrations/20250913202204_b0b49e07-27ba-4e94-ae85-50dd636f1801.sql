-- Cria função para vincular assinaturas ao usuário autenticado pelo e-mail
CREATE OR REPLACE FUNCTION public.claim_subscriptions_for_current_user()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_email text;
  v_user uuid;
  v_updated int;
BEGIN
  v_user := auth.uid();
  v_email := auth.email();

  IF v_user IS NULL OR v_email IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE public.assinaturas
  SET user_id = v_user,
      updated_at = now()
  WHERE user_id IS NULL
    AND email = v_email;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$;