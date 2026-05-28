-- ============================================================================
-- SUPABASE COMPLETE SCHEMA SETUP FOR ELITEBED PROJECT
-- ============================================================================
-- FINAL VERSION - This schema matches EXACTLY what Admin.jsx expects
-- Run ALL of these SQL commands in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. BEDS TABLE (Products - Beds, Mattresses, Sofas, Wardrobes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.beds (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  description text,
  image_url text,
  base_price_type text not null, -- e.g., 'HILTON', 'SLEIGH_ARIZONA', 'CUSTOM_<timestamp>', 'SOFA_<timestamp>', 'WARDROBE_<timestamp>'
  category text DEFAULT 'bed', -- Values: 'bed', 'mattress', 'sofa', 'wardrobe'
  features TEXT, -- JSON array of feature strings (for sofas)
  storage_type TEXT, -- For beds only - Storage layout type: 'Gas Lift', 'Drawers', 'No Need'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and allow public read access
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on beds" ON public.beds;
CREATE POLICY "Allow public read access on beds" ON public.beds FOR SELECT USING (true);

-- ============================================================================
-- 2. BED_OPTIONS TABLE (Dynamic Pricing Options)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bed_options (
  id uuid default gen_random_uuid() primary key,
  category text not null, -- Values: 'SIZE', 'FABRIC', 'COLOR', 'MATTRESS', 'STORAGE', 'PRICE_FRAME', 'PRICE_FULLSET', 'SOFA_SIZE', 'WARDROBE_SIZE'
  value text not null,
  price_modifier numeric default 0,
  base_price_type text, -- Links to beds.base_price_type (e.g., 'HILTON', 'CUSTOM_<timestamp>', 'SOFA_<timestamp>')
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and allow public read access
ALTER TABLE public.bed_options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on bed_options" ON public.bed_options;
CREATE POLICY "Allow public read access on bed_options" ON public.bed_options FOR SELECT USING (true);

-- ============================================================================
-- 3. ORDERS TABLE (Customer Orders - Cash On Delivery)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text,
  phone text not null,
  additional_phone text,
  delivery_date text,
  address text not null,
  city text,
  postcode text,
  cart_items jsonb not null, -- Array of: {id, name, price, quantity, img, selectedOptions}
  total_price numeric not null,
  status text default 'Pending', -- Values: 'Pending', 'Confirmed', 'Delivered', 'Cancelled'
  is_read boolean default false, -- Admin read status
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT orders (place an order)
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Allow anyone to SELECT orders (for Admin dashboard)
DROP POLICY IF EXISTS "Allow reading orders for admin" ON public.orders;
CREATE POLICY "Allow reading orders for admin" ON public.orders FOR SELECT USING (true);

-- Allow UPDATE of is_read column
DROP POLICY IF EXISTS "Allow updating order read status" ON public.orders;
CREATE POLICY "Allow updating order read status" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================================
-- 4. STORAGE BUCKET SETUP (For Product Images)
-- ============================================================================
-- 1. Create the bucket (named 'product-images')
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access (for frontend to display images)
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- 3. Allow anyone to upload images
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- ============================================================================
-- REFERENCE DOCUMENTATION
-- ============================================================================
-- 
-- BEDS TABLE USAGE:
--   - Stores all product types: beds, mattresses, sofas, wardrobes
--   - image_url: JSON array of image URLs (stored as string)
--   - features: JSON array of feature strings (for sofas only)
--   - storage_type: Only populated for beds (category='bed')
--
-- BED_OPTIONS TABLE CATEGORIES:
--   - PRICE_FRAME: Frame base prices for beds/mattresses by size (bed only)
--   - PRICE_FULLSET: Full bed + mattress prices by size (bed only)
--   - SIZE: Available sizes with price modifiers
--   - FABRIC, COLOR, MATTRESS, STORAGE: Additional options with modifiers
--   - SOFA_SIZE: Size options for sofas
--   - WARDROBE_SIZE: Size options for wardrobes
--
-- ORDERS TABLE:
--   - cart_items is JSONB array of ordered items
--   - Each item has: {id, name, price, quantity, img, selectedOptions{}}
--   - is_read: Boolean to track if admin has viewed the order
--
-- PRICING STRATEGIES:
--   - 'HILTON': Standard bed pricing (predefined in bed_options)
--   - 'SLEIGH_ARIZONA': Premium bed pricing (predefined in bed_options)
--   - 'CUSTOM_<timestamp>': Custom prices for specific bed/mattress
--   - 'SOFA_<timestamp>': Sofa with dynamic sizes
--   - 'WARDROBE_<timestamp>': Wardrobe with dynamic sizes
--
-- ============================================================================
