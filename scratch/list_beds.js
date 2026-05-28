import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('beds').select('id, name, category, base_price_type');
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Total beds in DB:', data.length);
    data.forEach(b => {
      console.log(`- Name: "${b.name}" | Category: "${b.category}" | BasePriceType: "${b.base_price_type}"`);
    });
  }
}

test();
