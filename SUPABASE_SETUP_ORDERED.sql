-- ============================================================================
-- SUPABASE SETUP - RUN THIS IN ORDER
-- ============================================================================
-- This combines ALL existing migration files in the correct sequence
-- Copy and paste ALL of this into Supabase SQL Editor and click RUN
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Base Tables (supabase_schema.sql)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.beds (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  description text,
  image_url text,
  base_price_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS public.bed_options (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  value text not null,
  price_modifier numeric default 0,
  base_price_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on beds" ON public.beds;
CREATE POLICY "Allow public read access on beds" ON public.beds FOR SELECT USING (true);

ALTER TABLE public.bed_options ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access on bed_options" ON public.bed_options;
CREATE POLICY "Allow public read access on bed_options" ON public.bed_options FOR SELECT USING (true);

-- ============================================================================
-- STEP 2: Create Orders Table (supabase_orders_setup.sql)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  phone text not null,
  additional_phone text,
  delivery_date text,
  address text not null,
  city text,
  postcode text,
  cart_items jsonb not null,
  total_price numeric not null,
  status text default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow reading orders for admin" ON public.orders;
CREATE POLICY "Allow reading orders for admin" ON public.orders FOR SELECT USING (true);

-- ============================================================================
-- STEP 3: Setup Storage Bucket (supabase_storage_setup.sql)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

-- ============================================================================
-- STEP 4: Add Category Column (supabase_mattress_update.sql)
-- ============================================================================
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS category text DEFAULT 'bed';

-- ============================================================================
-- STEP 5: Add Features Column (supabase_sofa_migration.sql)
-- ============================================================================
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS features TEXT;

-- ============================================================================
-- STEP 6: Add Email Column to Orders (supabase_add_email_column.sql)
-- ============================================================================
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email text;

-- ============================================================================
-- STEP 7: Add Missing Columns for Admin Functionality (NEW)
-- ============================================================================
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS storage_type TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_read boolean default false;

-- Add UPDATE policy for orders (needed for marking orders as read)
DROP POLICY IF EXISTS "Allow updating order read status" ON public.orders;
CREATE POLICY "Allow updating order read status" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================================
-- COMPLETE! All tables and columns are now ready
-- ============================================================================
-- Tables created:
--   1. beds (with category, features, storage_type columns)
--   2. bed_options (with base_price_type)
--   3. orders (with customer_email, is_read columns)
--   4. storage.product-images (bucket)
--
-- RLS Policies:
--   - Public read access on beds and bed_options
--   - Public insert on orders
--   - Public select on orders
--   - Public update on orders (for is_read status)
--   - Public read/insert on storage.product-images
-- ============================================================================
