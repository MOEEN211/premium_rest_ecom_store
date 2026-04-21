import { sendOrderEmail } from './src/utils/sendOrderEmail.js';

console.log('📧 Testing sendOrderEmail function directly...');

// Test the exact same data structure that checkout sends
const testOrderData = {
  orderId: 'TEST-' + Date.now(),
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerPhone: '07123456789',
  shippingAddress: '123 Test Street, London, UK',
  items: [
    {
      name: 'Test Bed',
      img: '/test-bed.jpg',
      quantity: 1,
      price: 299,
      selectedOptions: {
        Size: '3FT Single',
        Mattress: '8" Standard Eco-Spring',
        Color: 'Grey',
        Fabric: 'Crushed Velvet',
        Assembly: 'Bed Assembling'
      }
    }
  ],
  subtotal: 299,
  shipping: 0,
  assembly: 50,
  total: 349,
  hasAssembly: true
};

console.log('📊 Test order data:', JSON.stringify(testOrderData, null, 2));

// Test the email function
sendOrderEmail(testOrderData)
  .then(result => {
    if (result.success) {
      console.log('✅ SUCCESS: Email function works!');
      console.log('📧 Email was sent with these details:');
      console.log('   - Order ID:', testOrderData.orderId);
      console.log('   - Customer:', testOrderData.customerName);
      console.log('   - Email:', testOrderData.customerEmail);
      console.log('   - To: mooenijaz211@gmail.com');
    } else {
      console.error('❌ FAILED: Email function failed');
      console.error('   Error:', result.error);
    }
  })
  .catch(error => {
    console.error('❌ CATCH: Email function threw an error:', error);
  });
