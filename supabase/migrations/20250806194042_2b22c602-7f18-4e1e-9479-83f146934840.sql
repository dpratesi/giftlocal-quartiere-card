-- Add foreign key constraint between gift_cards and shops
ALTER TABLE public.gift_cards 
ADD CONSTRAINT gift_cards_shop_id_fkey 
FOREIGN KEY (shop_id) REFERENCES public.shops(id) ON DELETE CASCADE;