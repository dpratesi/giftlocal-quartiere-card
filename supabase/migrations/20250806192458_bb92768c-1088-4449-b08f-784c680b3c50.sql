-- Fix security warnings by updating function search paths
CREATE OR REPLACE FUNCTION public.generate_gift_card_code()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a 12-character alphanumeric code
    code := upper(substring(encode(gen_random_bytes(9), 'base64') from 1 for 12));
    -- Remove any non-alphanumeric characters
    code := regexp_replace(code, '[^A-Z0-9]', '', 'g');
    -- Ensure it's exactly 12 characters
    code := substring(code from 1 for 12);
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.purchased_gift_cards WHERE gift_card_code = code) INTO code_exists;
    
    -- If code doesn't exist and is 12 characters, exit loop
    IF NOT code_exists AND length(code) = 12 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Utente'),
    COALESCE(new.raw_user_meta_data->>'type', 'customer')
  );
  RETURN new;
END;
$$;