import http from 'http';

console.log('📧 Testing email server endpoint...');

const testData = JSON.stringify({
  to: 'moeenijaz211@gmail.com',
  from: 'test@example.com',
  subject: 'Test Email',
  html: '<h1>Test Email</h1><p>This is a test.</p>'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/send-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
    if (res.statusCode === 200) {
      console.log('✅ Server endpoint is working!');
    } else {
      console.log('❌ Server responded with:', res.statusCode);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(testData);
req.end();
