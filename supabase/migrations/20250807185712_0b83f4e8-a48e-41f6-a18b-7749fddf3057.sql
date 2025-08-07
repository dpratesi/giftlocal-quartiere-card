-- Inserimento negozi mancanti per completare 1 negozio per categoria per città
-- Assegnati all'utente pratesi.dd@gmail.com (ID: 68e8fc87-82c7-4352-ab78-0cfb29828902)

-- MILANO (mancano: abbigliamento, Caffetteria, Ristorante)
INSERT INTO shops (id, name, category, image, neighborhood, distance, description, city, owner_id, rating, review_count)
VALUES 
  (gen_random_uuid(), 'Atelier Milano', 'abbigliamento', '/placeholder.svg', 'Brera', '0.5 km', 'Boutique di abbigliamento di alta qualità nel cuore di Brera. Offriamo capi unici e ricercati per un look sempre impeccabile.', 'Milano', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.6, 89),
  (gen_random_uuid(), 'Caffè Centrale', 'Caffetteria', '/placeholder.svg', 'Duomo', '0.2 km', 'Storica caffetteria milanese fondata nel 1920. Serviamo il miglior espresso della città con dolci artigianali preparati quotidianamente.', 'Milano', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.8, 156),
  (gen_random_uuid(), 'Osteria del Naviglio', 'Ristorante', '/placeholder.svg', 'Navigli', '1.2 km', 'Autentica cucina lombarda in un ambiente accogliente sui Navigli. Specialità della casa: risotto alla milanese e cotoletta.', 'Milano', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.7, 203);

-- TORINO (mancano: Moda, Libreria, Gelateria, Caffetteria, Ristorante)
INSERT INTO shops (id, name, category, image, neighborhood, distance, description, city, owner_id, rating, review_count)
VALUES 
  (gen_random_uuid(), 'Eleganza Torinese', 'Moda', '/placeholder.svg', 'Centro', '0.3 km', 'Boutique di moda nel centro storico di Torino. Proponiamo le ultime tendenze e capi ricercati di stilisti italiani ed internazionali.', 'Torino', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.5, 112),
  (gen_random_uuid(), 'Libreria Subalpina', 'Libreria', '/placeholder.svg', 'Quadrilatero Romano', '0.8 km', 'Libreria indipendente specializzata in letteratura italiana e straniera. Organizziamo eventi culturali e presentazioni di libri.', 'Torino', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.6, 87),
  (gen_random_uuid(), 'Grom del Borgo', 'Gelateria', '/placeholder.svg', 'San Salvario', '1.0 km', 'Gelateria artigianale che utilizza solo ingredienti naturali e di stagione. I nostri gelati sono preparati quotidianamente con ricette tradizionali.', 'Torino', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.9, 178),
  (gen_random_uuid(), 'Caffè Reale', 'Caffetteria', '/placeholder.svg', 'Centro', '0.1 km', 'Elegante caffetteria torinese con vista su Palazzo Reale. Offriamo caffè di alta qualità e pasticceria piemontese tradizionale.', 'Torino', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.7, 134),
  (gen_random_uuid(), 'Trattoria del Borgo', 'Ristorante', '/placeholder.svg', 'Borgo Po', '1.5 km', 'Trattoria tipica piemontese che propone cucina tradizionale con ingredienti a km zero. Specialità: agnolotti del plin e brasato al Barolo.', 'Torino', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.8, 192);