import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohtlnyusuringvjesnkg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_secret_key_here';

const supabase = createClient(supabaseUrl, supabaseKey);

const bedsData = [
  {
    "name": "Hilton Bed with Mattress And Gas Lift Storage",
    "image_url": "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/hilton-bed-5.jpeg",
    "base_price_type": "HILTON",
    "description": "Luxurious Hilton bed with exquisite detailing."
  },
  {
    "name": "Florida Bed with Mattress And Gas Lift Storage",
    "image_url": "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/florida-bed-2.jpeg",
    "base_price_type": "HILTON",
    "description": "Florida bed offering ultimate comfort."
  },
  {
    "name": "Panel Wingline Bed with Mattress And Gas Lift Storage",
    "image_url": "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/WhatsApp-Image-2026-03-13-at-23.29.40.jpeg",
    "base_price_type": "HILTON",
    "description": "Elegant Wingline panel design."
  },
  {
    "name": "Arizona Bed With Mattress And Storage",
    "image_url": "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/Arizona-bed-1.jpeg",
    "base_price_type": "SLEIGH_ARIZONA",
    "description": "Arizona style bed with premium fabric."
  },
  {
    "name": "Bumper Panel Bed with Mattress And Gas Lift Storage",
    "image_url": "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/Bumper-Panel-Bed.jpeg",
    "base_price_type": "HILTON",
    "description": "Statement bumper panel bed."
  },
  {
    "name": "Divan Ottoman Storage Bed With Mattress",
    "image_url": "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/Divan-Ottoman-Storage-Bed.jpeg",
    "base_price_type": "HILTON",
    "description": "Classic Divan Ottoman base with plenty of storage."
  }
];

async function run() {
  console.log("Attempting to insert beds...");
  const { data, error } = await supabase.from('beds').upsert(bedsData, { onConflict: 'name' }).select();
  if (error) {
    console.error("Error inserting data:", error.message);
  } else {
    console.log("Successfully inserted beds:", data.length);
  }
}

run();
