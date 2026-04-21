-- Run this in Supabase SQL Editor to add sofa features support

-- Add features column to beds table (stores JSON array of feature strings)
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS features TEXT;

-- Allow sofa size options to be read publicly
-- (bed_options already has public read policy, so SOFA_SIZE category will work automatically)

-- Example: After running the app, sofa sizes will be stored in bed_options with:
-- category = 'SOFA_SIZE'
-- value = '3 Seater'
-- price_modifier = 499
-- base_price_type = 'CUSTOM_<timestamp>' (linked to specific sofa product)
