-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name_it TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Anyone can view active categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

-- Create trigger for timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing categories with proper Italian names
INSERT INTO public.categories (key, name_it, name_en, icon, sort_order) VALUES
('all', 'Tutti', 'All', 'Gift', 0),
('bar-caffe', 'Caffetteria', 'Coffee Shop', 'Coffee', 1),
('ristoranti', 'Ristorante', 'Restaurant', 'UtensilsCrossed', 2),
('librerie', 'Libreria', 'Bookstore', 'Book', 3),
('bellezza', 'Bellezza', 'Beauty', 'Scissors', 4),
('abbigliamento', 'Abbigliamento', 'Clothing', 'Shirt', 5),
('alimentari', 'Alimentari', 'Grocery', 'ShoppingCart', 6),
('gelateria', 'Gelateria', 'Ice Cream Shop', 'IceCream', 7);