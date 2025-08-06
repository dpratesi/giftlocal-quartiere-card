-- Create purchased_gift_cards table for tracking actual gift card purchases
CREATE TABLE public.purchased_gift_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  shop_id UUID NOT NULL,
  gift_card_code TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  remaining_value INTEGER NOT NULL,
  recipient_email TEXT,
  recipient_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '1 year'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchased_gift_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for purchased gift cards
CREATE POLICY "Users can view their own purchased gift cards" 
ON public.purchased_gift_cards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchased gift cards" 
ON public.purchased_gift_cards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Shop owners can view gift cards for their shops" 
ON public.purchased_gift_cards 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM shops 
  WHERE shops.id = purchased_gift_cards.shop_id 
  AND shops.owner_id = auth.uid()
));

CREATE POLICY "Shop owners can update gift cards for redemption" 
ON public.purchased_gift_cards 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM shops 
  WHERE shops.id = purchased_gift_cards.shop_id 
  AND shops.owner_id = auth.uid()
));

-- Create function to generate unique gift card codes
CREATE OR REPLACE FUNCTION public.generate_gift_card_code()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_purchased_gift_cards_updated_at
BEFORE UPDATE ON public.purchased_gift_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();