-- Create gift card transactions table
CREATE TABLE public.gift_card_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_card_id UUID NOT NULL REFERENCES public.purchased_gift_cards(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES public.shops(id),
  merchant_id UUID NOT NULL REFERENCES public.profiles(id),
  amount_used DECIMAL(10,2) NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_card_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for gift card transactions
CREATE POLICY "Users can view transactions for their gift cards" 
ON public.gift_card_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.purchased_gift_cards 
    WHERE purchased_gift_cards.id = gift_card_transactions.gift_card_id 
    AND purchased_gift_cards.user_id = auth.uid()
  )
);

CREATE POLICY "Merchants can view transactions for their shops" 
ON public.gift_card_transactions 
FOR SELECT 
USING (merchant_id = auth.uid());

CREATE POLICY "Merchants can insert transactions for redemptions" 
ON public.gift_card_transactions 
FOR INSERT 
WITH CHECK (merchant_id = auth.uid());

-- Create index for better performance
CREATE INDEX idx_gift_card_transactions_gift_card_id ON public.gift_card_transactions(gift_card_id);
CREATE INDEX idx_gift_card_transactions_shop_id ON public.gift_card_transactions(shop_id);
CREATE INDEX idx_gift_card_transactions_merchant_id ON public.gift_card_transactions(merchant_id);