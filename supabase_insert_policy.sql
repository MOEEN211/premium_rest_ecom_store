-- Enable INSERT for beds table
CREATE POLICY "Allow public insert access on beds" ON public.beds FOR INSERT WITH CHECK (true);

-- Enable INSERT for bed_options table
CREATE POLICY "Allow public insert access on bed_options" ON public.bed_options FOR INSERT WITH CHECK (true);
