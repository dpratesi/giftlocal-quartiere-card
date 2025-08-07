-- Inserimento negozi per Roma e Napoli
-- 1 negozio per categoria per città assegnati a pratesi.dd@gmail.com (ID: 68e8fc87-82c7-4352-ab78-0cfb29828902)

-- ROMA (6 categorie: abbigliamento, Caffetteria, Gelateria, Libreria, Moda, Ristorante)
INSERT INTO shops (id, name, category, image, neighborhood, distance, description, city, owner_id, rating, review_count)
VALUES 
  (gen_random_uuid(), 'Roma Fashion House', 'abbigliamento', '/placeholder.svg', 'Tridente', '0.4 km', 'Boutique di abbigliamento di lusso nel cuore del Tridente romano. Collezioni esclusive di designer italiani e internazionali.', 'Roma', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.7, 142),
  (gen_random_uuid(), 'Caffè della Fontana', 'Caffetteria', '/placeholder.svg', 'Trastevere', '0.6 km', 'Storico caffè romano con vista su Fontana di Trevi. Tradizione romana dal 1885 con il miglior caffè della Capitale.', 'Roma', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.9, 287),
  (gen_random_uuid(), 'Gelateria del Pantheon', 'Gelateria', '/placeholder.svg', 'Centro Storico', '0.2 km', 'Gelateria artigianale a due passi dal Pantheon. Gelati preparati con ingredienti freschi e ricette segrete di famiglia.', 'Roma', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.8, 198),
  (gen_random_uuid(), 'Libreria Antiquaria Romana', 'Libreria', '/placeholder.svg', 'Campo de Fiori', '0.7 km', 'Libreria storica specializzata in testi antichi e moderni. Un punto di riferimento culturale nel cuore di Roma.', 'Roma', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.6, 95),
  (gen_random_uuid(), 'Atelier Capitolino', 'Moda', '/placeholder.svg', 'Via del Corso', '0.3 km', 'Atelier di alta moda romana con creazioni esclusive. Dove tradizione sartoriale incontra il design contemporaneo.', 'Roma', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.8, 156),
  (gen_random_uuid(), 'Osteria Romana Tradizionale', 'Ristorante', '/placeholder.svg', 'Testaccio', '1.1 km', 'Autentica cucina romana nel quartiere Testaccio. Specialità: carbonara, amatriciana e cacio e pepe della tradizione.', 'Roma', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.9, 324);

-- NAPOLI (6 categorie: abbigliamento, Caffetteria, Gelateria, Libreria, Moda, Ristorante)
INSERT INTO shops (id, name, category, image, neighborhood, distance, description, city, owner_id, rating, review_count)
VALUES 
  (gen_random_uuid(), 'Napoli Style Boutique', 'abbigliamento', '/placeholder.svg', 'Chiaia', '0.5 km', 'Elegante boutique nel quartiere Chiaia. Selezione curata di capi alla moda per uno stile napoletano contemporaneo.', 'Napoli', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.5, 118),
  (gen_random_uuid(), 'Caffè del Golfo', 'Caffetteria', '/placeholder.svg', 'Lungomare', '0.3 km', 'Caffetteria storica sul Lungomare con vista mozzafiato sul Golfo di Napoli. Il caffè napoletano più autentico della città.', 'Napoli', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.8, 231),
  (gen_random_uuid(), 'Gelateria Vesuviana', 'Gelateria', '/placeholder.svg', 'Spaccanapoli', '0.8 km', 'Gelateria artigianale nel cuore di Spaccanapoli. Gelati e sorbetti con sapori tipici campani come limoncello e sfogliatelle.', 'Napoli', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.7, 167),
  (gen_random_uuid(), 'Libreria Partenopea', 'Libreria', '/placeholder.svg', 'Centro Storico', '0.4 km', 'Libreria indipendente specializzata in cultura partenopea e letteratura del Sud Italia. Punto di incontro per intellettuali e appassionati.', 'Napoli', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.6, 89),
  (gen_random_uuid(), 'Moda Napoletana', 'Moda', '/placeholder.svg', 'Via Toledo', '0.2 km', 'Boutique di moda su Via Toledo che celebra lo stile napoletano. Collezioni esclusive che uniscono tradizione e innovazione.', 'Napoli', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.7, 134),
  (gen_random_uuid(), 'Trattoria del Porto', 'Ristorante', '/placeholder.svg', 'Borgo Marinari', '1.3 km', 'Trattoria di pesce fresco nel suggestivo Borgo Marinari. Specialità: spaghetti alle vongole, frittura di paranza e baccalà.', 'Napoli', '68e8fc87-82c7-4352-ab78-0cfb29828902', 4.9, 278);