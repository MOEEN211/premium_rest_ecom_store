-- 1. Add storage_type to the beds table to distinguish between Drawer configurations and Gas Lift configurations
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS storage_type text DEFAULT 'Gas Lift';

-- 2. Allow public deleting of beds so the Admin dashboard can accurately remove listings
CREATE POLICY "Public Delete Access" ON public.beds FOR DELETE USING (true);
