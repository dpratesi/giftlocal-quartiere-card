
-- Create table for shop discounts
CREATE TABLE public.shop_discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  gift_card_amount INTEGER NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.shop_discounts ENABLE ROW LEVEL SECURITY;

-- Create policy for shop owners to manage their discounts
CREATE POLICY "Shop owners can manage their discounts" 
  ON public.shop_discounts 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = shop_discounts.shop_id 
    AND shops.owner_id = auth.uid()
  ));

-- Create policy for anyone to view active discounts
CREATE POLICY "Anyone can view active discounts" 
  ON public.shop_discounts 
  FOR SELECT 
  USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_shop_discounts_updated_at 
  BEFORE UPDATE ON public.shop_discounts 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
