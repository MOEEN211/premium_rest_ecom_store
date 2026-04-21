-- Orders table for Cash On Delivery checkout
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

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to place an order (INSERT)
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Allow reading orders (for Admin dashboard)
DROP POLICY IF EXISTS "Allow reading orders for admin" ON public.orders;
CREATE POLICY "Allow reading orders for admin" ON public.orders FOR SELECT USING (true);
