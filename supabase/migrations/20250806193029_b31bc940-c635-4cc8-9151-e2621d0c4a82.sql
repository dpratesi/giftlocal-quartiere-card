-- Fix the gift card code generation function to use the correct PostgreSQL function
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
    -- Generate a 12-character code using md5 and random()
    code := upper(substring(md5(random()::text) from 1 for 12));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.purchased_gift_cards WHERE gift_card_code = code) INTO code_exists;
    
    -- If code doesn't exist, exit loop
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Add foreign key relationship between purchased_gift_cards and shops
ALTER TABLE public.purchased_gift_cards 
ADD CONSTRAINT fk_purchased_gift_cards_shop_id 
FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;