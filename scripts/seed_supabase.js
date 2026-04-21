import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohtlnyusuringvjesnkg.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_secret_key_here'; // Service Role
const supabase = createClient(supabaseUrl, supabaseKey);

const bedsData = [
  {
    "name": "Oxford Wingback Bed",
    "description": "High wingback bed offering luxury and supreme comfort.",
    "base_price_type": "SLEIGH_ARIZONA",
    "image_url": JSON.stringify([
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/Oxford-Wingback-Bed.jpeg",
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/Oxford-Wingback-Bed-1.jpeg"
    ])
  },
  {
    "name": "Hilton Bed",
    "description": "Premium Hilton bed with plush upholstery.",
    "base_price_type": "HILTON",
    "image_url": JSON.stringify([
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/hilton-bed-5.jpeg",
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/hilton-bed-4.jpeg"
    ])
  },
  {
    "name": "Florida Bed",
    "description": "Elegant Florida bed for an opulent bedroom.",
    "base_price_type": "HILTON",
    "image_url": JSON.stringify([
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/florida-bed-2.jpeg",
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/florida-bed-3.jpeg"
    ])
  },
  {
    "name": "Bumper Panel Bed",
    "description": "Modern bumper panel bed with deep padded squares.",
    "base_price_type": "HILTON",
    "image_url": JSON.stringify([
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/Bumper-Panel-Bed.jpeg",
      "https://premiumrestfurniture.co.uk/wp-content/uploads/2025/12/bumper-panel-bed-5-1024x1011.jpeg"
    ])
  }
];

const bedOptionsData = [
  // HILTON Frame Prices (No mattress)
  { category: "PRICE_FRAME", value: "3FT Single", price_modifier: 160, base_price_type: "HILTON" },
  { category: "PRICE_FRAME", value: "4FT Small Double", price_modifier: 180, base_price_type: "HILTON" },
  { category: "PRICE_FRAME", value: "4FT6 Double", price_modifier: 180, base_price_type: "HILTON" },
  { category: "PRICE_FRAME", value: "5FT King Size", price_modifier: 190, base_price_type: "HILTON" },
  { category: "PRICE_FRAME", value: "6FT Super King Size", price_modifier: 250, base_price_type: "HILTON" },
  
  // HILTON Full Set Prices (8" Standard Eco-Spring)
  { category: "PRICE_FULLSET", value: "3FT Single", price_modifier: 190, base_price_type: "HILTON" },
  { category: "PRICE_FULLSET", value: "4FT Small Double", price_modifier: 220, base_price_type: "HILTON" },
  { category: "PRICE_FULLSET", value: "4FT6 Double", price_modifier: 220, base_price_type: "HILTON" },
  { category: "PRICE_FULLSET", value: "5FT King Size", price_modifier: 240, base_price_type: "HILTON" },
  { category: "PRICE_FULLSET", value: "6FT Super King Size", price_modifier: 320, base_price_type: "HILTON" },
  
  // SLEIGH_ARIZONA Frame Prices (No mattress)
  { category: "PRICE_FRAME", value: "3FT Single", price_modifier: 180, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FRAME", value: "4FT Small Double", price_modifier: 210, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FRAME", value: "4FT6 Double", price_modifier: 210, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FRAME", value: "5FT King Size", price_modifier: 230, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FRAME", value: "6FT Super King Size", price_modifier: 270, base_price_type: "SLEIGH_ARIZONA" },
  
  // SLEIGH_ARIZONA Full Set Prices (8" Standard Eco-Spring)
  { category: "PRICE_FULLSET", value: "3FT Single", price_modifier: 220, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FULLSET", value: "4FT Small Double", price_modifier: 260, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FULLSET", value: "4FT6 Double", price_modifier: 260, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FULLSET", value: "5FT King Size", price_modifier: 290, base_price_type: "SLEIGH_ARIZONA" },
  { category: "PRICE_FULLSET", value: "6FT Super King Size", price_modifier: 350, base_price_type: "SLEIGH_ARIZONA" },

  // Global Upgrades (No base_price_type specific)
  { category: "MATTRESS_UPGRADE", value: 'No Mattress', price_modifier: 0, base_price_type: null },
  { category: "MATTRESS_UPGRADE", value: '8" Standard Eco-Spring', price_modifier: 0, base_price_type: null },
  { category: "MATTRESS_UPGRADE", value: '10" Full Memory Foam', price_modifier: 20, base_price_type: null },
  { category: "MATTRESS_UPGRADE", value: '10" Memory Foam Spring', price_modifier: 20, base_price_type: null },
  { category: "MATTRESS_UPGRADE", value: '10" Orthopedic Firm', price_modifier: 40, base_price_type: null },

  { category: "STORAGE_UPGRADE", value: 'No Storage', price_modifier: 0, base_price_type: null },
  { category: "STORAGE_UPGRADE", value: 'Gas Lift', price_modifier: 100, base_price_type: null }
];

async function seed() {
  console.log("Emptying old beds...");
  await supabase.from('beds').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('bed_options').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log("Inserting beds...");
  const { error: bedErr } = await supabase.from('beds').insert(bedsData);
  if (bedErr) console.error("Bed error:", bedErr);

  console.log("Inserting options...");
  const { error: optErr } = await supabase.from('bed_options').insert(bedOptionsData);
  if (optErr) console.error("Options error:", optErr);

  console.log("Done seeding!");
}
seed();
