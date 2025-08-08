-- Add status column to shops table
ALTER TABLE public.shops 
ADD COLUMN status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));