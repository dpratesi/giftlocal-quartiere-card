-- Aggiunta gift card per tutti i negozi di pratesi.dd@gmail.com
-- Importi standard: 25, 50, 100 euro per ogni negozio

INSERT INTO gift_cards (shop_id, amount, is_active)
SELECT s.id, amounts.amount, true
FROM shops s
CROSS JOIN (VALUES (25), (50), (100)) AS amounts(amount)
WHERE s.owner_id = '68e8fc87-82c7-4352-ab78-0cfb29828902';