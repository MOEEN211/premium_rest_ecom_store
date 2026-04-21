import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const testOrder = {
    customer_name: "Test User",
    customer_email: "test@example.com",
    phone: "1234567890",
    address: "123 Test St",
    cart_items: [{ name: "Test Product", quantity: 1, price: 10 }],
    total_price: 10
  };

  console.log('Attempting to insert order:', testOrder);
  
  const { data, error } = await supabase
    .from('orders')
    .insert([testOrder])
    .select();

  if (error) {
    console.error('INSERT ERROR:', error);
  } else {
    console.log('INSERT SUCCESS:', data);
  }
}

testInsert();
