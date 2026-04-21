-- Table to store bed products
CREATE TABLE IF NOT EXISTS public.beds (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  description text,
  image_url text,
  base_price_type text not null, -- e.g., 'HILTON', 'SLEIGH_ARIZONA'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table to store dynamic pricing options like sizes, mattresses, storage
CREATE TABLE IF NOT EXISTS public.bed_options (
  id uuid default gen_random_uuid() primary key,
  category text not null, -- 'SIZE', 'FABRIC', 'COLOR', 'MATTRESS', 'STORAGE'
  value text not null,
  price_modifier numeric default 0,
  base_price_type text, -- 'HILTON', 'SLEIGH_ARIZONA', or NULL for global rules
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable reading for all users
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on beds" ON public.beds FOR SELECT USING (true);

ALTER TABLE public.bed_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on bed_options" ON public.bed_options FOR SELECT USING (true);
