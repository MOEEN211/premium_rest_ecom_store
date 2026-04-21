-- 1. Add category to beds table to distinguish between complete 'bed' frames and standalone 'mattress'
ALTER TABLE public.beds ADD COLUMN IF NOT EXISTS category text DEFAULT 'bed';
