-- Add BED_BASE options for beds
-- Run this in your Supabase SQL Editor

-- Insert BED_BASE options
-- These are only available for regular beds (NOT Divan, Ottoman, or Storage beds)

INSERT INTO public.bed_options (category, value, price_modifier, base_price_type, created_at) VALUES
('BED_BASE', 'With Wooden Slats Base', 0, 'HILTON', NOW()),
('BED_BASE', 'Solid Wooden Board Base', 35, 'HILTON', NOW())
ON CONFLICT DO NOTHING;

-- If you have other bed types (SLEIGH_ARIZONA, etc.), add their bases too:
-- INSERT INTO public.bed_options (category, value, price_modifier, base_price_type, created_at) VALUES
-- ('BED_BASE', 'With Wooden Slats Base', 0, 'SLEIGH_ARIZONA', NOW()),
-- ('BED_BASE', 'Solid Wooden Board Base', 35, 'SLEIGH_ARIZONA', NOW())
-- ON CONFLICT DO NOTHING;
