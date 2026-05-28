
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ohtlnyusuringvjesnkg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("No Supabase key found in env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOptions() {
  console.log("Checking bed_options table...");
  const { data: options, error } = await supabase
    .from('bed_options')
    .select('category, value, base_price_type')
    .limit(20);

  if (error) {
    console.error("Error fetching options:", error.message);
  } else {
    console.log("Found options (first 20):", options);
    
    const hiltonCount = options.filter(o => o.base_price_type === 'HILTON').length;
    const sleighCount = options.filter(o => o.base_price_type === 'SLEIGH').length;
    const sleighArizonaCount = options.filter(o => o.base_price_type === 'SLEIGH_ARIZONA').length;
    
    console.log(`\nSummary:`);
    console.log(`- HILTON options: ${hiltonCount}`);
    console.log(`- SLEIGH options: ${sleighCount}`);
    console.log(`- SLEIGH_ARIZONA options: ${sleighArizonaCount}`);
  }

  console.log("\nChecking beds table for recent product...");
  const { data: beds, error: bedErr } = await supabase
    .from('beds')
    .select('id, name, base_price_type, category')
    .order('created_at', { ascending: false })
    .limit(1);

  if (bedErr) {
    console.error("Error fetching beds:", bedErr.message);
  } else if (beds && beds.length > 0) {
    console.log("Most recent bed:", beds[0]);
  } else {
    console.log("No beds found.");
  }
}

checkOptions();
