-- Add is_read flag to orders table for admin read/unread management
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;

-- Allow updating is_read (mark read/unread) from the frontend admin dashboard.
-- Without this UPDATE policy, `is_read` changes will fail due to RLS.
DROP POLICY IF EXISTS "Allow public update is_read" ON public.orders;
CREATE POLICY "Allow public update is_read" ON public.orders
FOR UPDATE
USING (true)
WITH CHECK (true);
