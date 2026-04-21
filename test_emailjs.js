// Test EmailJS function
const SERVICE_ID  = 'service_rg6nwuf';
const TEMPLATE_ID = 'template_qxwqa9o';
const PUBLIC_KEY  = 'HTVX1ebXlWIIqVAhw';
const PRIVATE_KEY = 'yTgn5BJhJgt0MX4oJfBfH';

async function testEmailJS() {
  const payload = {
    service_id:  SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id:     PUBLIC_KEY,
    accessToken: PRIVATE_KEY,
    template_params: {
      to_email: 'moeenijaz211@gmail.com',
      orderId: 'TEST-123',
      orderDate: new Date().toLocaleDateString('en-GB'),
      orderTime: new Date().toLocaleTimeString('en-GB'),
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '1234567890',
      shippingAddress: 'Test Address',
      items: [],
      itemCount: 0,
      subtotal: '0.00',
      shipping: '0.00',
      total: '0.00',
      hasAssembly: false,
      assembly: '0.00',
      timestamp: new Date().toLocaleString('en-GB'),
    }
  };

  try {
    console.log('🧪 Testing EmailJS with payload:', payload);
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log('🧪 Test response status:', res.status);
    const responseText = await res.text();
    console.log('🧪 Test response:', responseText);
    
    if (res.ok) {
      console.log('✅ EmailJS test successful!');
    } else {
      console.error('❌ EmailJS test failed:', responseText);
    }
  } catch (error) {
    console.error('❌ EmailJS test error:', error);
  }
}

// Run the test
testEmailJS();
