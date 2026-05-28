-- ============================================================================
-- FIX RLS POLICIES FOR BED_OPTIONS AND BEDS INSERTS
-- ============================================================================
-- Run this in Supabase SQL Editor to allow Admin to upload products

-- Add INSERT policy for bed_options table
DROP POLICY IF EXISTS "Allow public insert to bed_options" ON public.bed_options;
CREATE POLICY "Allow public insert to bed_options" ON public.bed_options FOR INSERT WITH CHECK (true);

-- Add INSERT policy for beds table
DROP POLICY IF EXISTS "Allow public insert to beds" ON public.beds;
CREATE POLICY "Allow public insert to beds" ON public.beds FOR INSERT WITH CHECK (true);

-- Add UPDATE policy for beds table (for editing products)
DROP POLICY IF EXISTS "Allow public update to beds" ON public.beds;
CREATE POLICY "Allow public update to beds" ON public.beds FOR UPDATE USING (true) WITH CHECK (true);

-- Add DELETE policy for beds table (for deleting products)
DROP POLICY IF EXISTS "Allow public delete from beds" ON public.beds;
CREATE POLICY "Allow public delete from beds" ON public.beds FOR DELETE USING (true);

-- Add DELETE policy for bed_options table (for cleaning up options)
DROP POLICY IF EXISTS "Allow public delete from bed_options" ON public.bed_options;
CREATE POLICY "Allow public delete from bed_options" ON public.bed_options FOR DELETE USING (true);

-- ============================================================================
-- DONE! All RLS policies are now configured for Admin functionality
-- ============================================================================
