-- 1. Create the bucket (named 'product-images')
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access so your frontend can display the uploaded bed images
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- 3. Allow anyone to upload images to this bucket (required for the Admin form to work)
CREATE POLICY "Public Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
