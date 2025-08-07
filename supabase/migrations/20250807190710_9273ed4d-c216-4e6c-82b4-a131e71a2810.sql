-- Aggiunta gift card per i nuovi negozi di Roma e Napoli
-- Importi standard: 25, 50, 100 euro per ogni negozio

INSERT INTO gift_cards (shop_id, amount, is_active)
SELECT s.id, amounts.amount, true
FROM shops s
CROSS JOIN (VALUES (25), (50), (100)) AS amounts(amount)
WHERE s.owner_id = '68e8fc87-82c7-4352-ab78-0cfb29828902'
  AND s.city IN ('Roma', 'Napoli')
  AND NOT EXISTS (
    SELECT 1 FROM gift_cards gc 
    WHERE gc.shop_id = s.id AND gc.amount = amounts.amount
  );