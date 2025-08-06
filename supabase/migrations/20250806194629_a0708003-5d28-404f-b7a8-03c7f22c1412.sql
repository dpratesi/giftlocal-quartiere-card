-- Fix merchant-shop relationship: remove shop_id from profiles and ensure proper owner_id setup

-- First, let's assign some existing shops to the merchant users we have
-- This is a temporary assignment for demonstration - in a real scenario, 
-- merchants would register their own shops

UPDATE public.shops 
SET owner_id = (
  SELECT id 
  FROM public.profiles 
  WHERE type = 'merchant' 
  LIMIT 1
)
WHERE id IN (
  SELECT id 
  FROM public.shops 
  LIMIT 2
);

-- Assign remaining shops to second merchant if exists
UPDATE public.shops 
SET owner_id = (
  SELECT id 
  FROM public.profiles 
  WHERE type = 'merchant' 
  AND id != (
    SELECT id 
    FROM public.profiles 
    WHERE type = 'merchant' 
    LIMIT 1
  )
  LIMIT 1
)
WHERE owner_id IS NULL;

-- Remove the shop_id column from profiles table since it's not needed
-- A merchant can own multiple shops, so the relationship should be one-to-many
ALTER TABLE public.profiles DROP COLUMN IF EXISTS shop_id;

-- Add index on owner_id for better performance when querying shops by merchant
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);