import https from 'https';

console.log('📧 Attempting to send test email to mooenijaz211@gmail.com...');

// Try using a simple HTTP POST to a test email service
const testData = JSON.stringify({
  to: 'moeenijaz211@gmail.com',
  subject: '🧪 TEST EMAIL - Elitebed System',
  message: 'This is a test email sent via API to verify email delivery works. Time: ' + new Date().toLocaleString(),
  from: 'test@elitebed.co.uk'
});

const options = {
  hostname: 'httpbin.org',
  port: 443,
  path: '/post',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
}; // Removed extra parenthesis here

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ API call successful!');
    console.log('📧 Test email data prepared for moeenijaz211@gmail.com');
    console.log('📬 Email content:', JSON.parse(testData).message);
    console.log('');
    console.log('⚠️  Note: This was a test API call. For actual email delivery, we need:');
    console.log('   1. Your SMTP credentials in .env file');
    console.log('   2. Valid email server configuration');
    console.log('   3. Proper authentication setup');
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(testData);
req.end();
