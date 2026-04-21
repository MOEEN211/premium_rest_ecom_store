import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: options } = await supabase.from('bed_options').select('*').eq('base_price_type', 'SOFA_1774949631407');
  console.log('Options for aaa:', options);
}

check();
