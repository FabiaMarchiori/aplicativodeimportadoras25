-- Remove insecure function that bypasses Supabase Auth
-- This function directly manipulates auth.users table which bypasses
-- Supabase's native security validations and should not be used

DROP FUNCTION IF EXISTS public.get_or_create_user_by_email(text);