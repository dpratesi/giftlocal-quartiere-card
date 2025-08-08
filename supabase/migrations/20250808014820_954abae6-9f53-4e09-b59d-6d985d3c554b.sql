-- Clean up old gift_cards data since we now use dynamic pricing
UPDATE gift_cards SET is_active = false WHERE shop_id IN (SELECT id FROM shops);