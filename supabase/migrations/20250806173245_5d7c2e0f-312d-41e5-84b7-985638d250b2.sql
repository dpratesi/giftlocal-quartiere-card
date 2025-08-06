
-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('customer', 'merchant')),
  shop_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create shops table (migrating from static JSON)
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  neighborhood TEXT NOT NULL,
  distance TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create gift_cards table for shop gift card offerings
CREATE TABLE public.gift_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view profiles for public data" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- RLS Policies for shops
CREATE POLICY "Anyone can view shops" 
  ON public.shops 
  FOR SELECT 
  USING (true);

CREATE POLICY "Merchants can manage their own shops" 
  ON public.shops 
  FOR ALL 
  USING (owner_id = auth.uid());

-- RLS Policies for gift_cards
CREATE POLICY "Anyone can view active gift cards" 
  ON public.gift_cards 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Shop owners can manage their gift cards" 
  ON public.gift_cards 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.shops 
      WHERE shops.id = gift_cards.shop_id 
      AND shops.owner_id = auth.uid()
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Utente'),
    COALESCE(new.raw_user_meta_data->>'type', 'customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample shops data
INSERT INTO public.shops (id, name, category, image, rating, review_count, neighborhood, distance, description, city) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Caffè Centrale', 'Caffetteria', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24', 4.5, 127, 'Centro Storico', '0.2 km', 'Il caffè del cuore di Milano, dove tradizione e qualità si incontrano ogni giorno.', 'Milano'),
('550e8400-e29b-41d4-a716-446655440002', 'Trattoria da Mario', 'Ristorante', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 4.8, 89, 'Navigli', '0.5 km', 'Cucina tradizionale milanese in un ambiente familiare e accogliente.', 'Milano'),
('550e8400-e29b-41d4-a716-446655440003', 'Boutique Elisa', 'Moda', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8', 4.3, 156, 'Quadrilatero della Moda', '0.8 km', 'Abbigliamento di tendenza per ogni occasione, con uno stile unico e ricercato.', 'Milano'),
('550e8400-e29b-41d4-a716-446655440004', 'Libreria del Corso', 'Libreria', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570', 4.6, 203, 'Brera', '1.2 km', 'Un mondo di libri e cultura nel cuore artistico di Milano.', 'Milano'),
('550e8400-e29b-41d4-a716-446655440005', 'Gelateria Artigianale', 'Gelateria', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57', 4.9, 324, 'Porta Ticinese', '0.7 km', 'Gelato artigianale con ingredienti freschi e naturali, preparato ogni giorno.', 'Milano');

-- Insert sample gift cards for shops
INSERT INTO public.gift_cards (shop_id, amount) VALUES
('550e8400-e29b-41d4-a716-446655440001', 25),
('550e8400-e29b-41d4-a716-446655440001', 50),
('550e8400-e29b-41d4-a716-446655440001', 100),
('550e8400-e29b-41d4-a716-446655440002', 30),
('550e8400-e29b-41d4-a716-446655440002', 60),
('550e8400-e29b-41d4-a716-446655440002', 120),
('550e8400-e29b-41d4-a716-446655440003', 50),
('550e8400-e29b-41d4-a716-446655440003', 100),
('550e8400-e29b-41d4-a716-446655440003', 200),
('550e8400-e29b-41d4-a716-446655440004', 20),
('550e8400-e29b-41d4-a716-446655440004', 40),
('550e8400-e29b-41d4-a716-446655440004', 80),
('550e8400-e29b-41d4-a716-446655440005', 15),
('550e8400-e29b-41d4-a716-446655440005', 35),
('550e8400-e29b-41d4-a716-446655440005', 70);
