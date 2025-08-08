-- Update existing shop categories to use standardized values
UPDATE shops 
SET category = CASE 
  WHEN category = 'Caffetteria' THEN 'bar-caffe'
  WHEN category = 'Ristorante' THEN 'ristoranti'
  WHEN category = 'Libreria' THEN 'librerie'
  WHEN category = 'Moda' THEN 'bellezza'
  WHEN category = 'Gelateria' THEN 'gelateria'
  WHEN category = 'abbigliamento' THEN 'abbigliamento'
  ELSE category
END
WHERE category IN ('Caffetteria', 'Ristorante', 'Libreria', 'Moda', 'Gelateria');