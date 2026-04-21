-- Add features column to beds table
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS features text;
-- Also ensure category exists (it was missing from my first view of schema)
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS category text DEFAULT 'bed';
