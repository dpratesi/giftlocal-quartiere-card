-- Add min_gift_card_amount column to shops table
ALTER TABLE public.shops 
ADD COLUMN min_gift_card_amount integer NOT NULL DEFAULT 25 
CHECK (min_gift_card_amount IN (25, 50, 100));

-- Migrate existing data: set min_gift_card_amount based on lowest gift_card amount for each shop
UPDATE public.shops 
SET min_gift_card_amount = COALESCE(
  (SELECT MIN(amount) FROM public.gift_cards WHERE shop_id = shops.id AND is_active = true),
  25
);

-- Add comment for clarity
COMMENT ON COLUMN public.shops.min_gift_card_amount IS 'Minimum gift card amount (25, 50, or 100) - system will generate 3 tiers from this base';