const express = 'express';
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🌐 Starting simple test server on port 3002...');

app.post('/send-email', (req, res) => {
  console.log('✅ Received POST to /send-email on port 3002');
  console.log('📊 Body:', req.body);
  
  res.status(200).json({ 
    success: true, 
    message: 'Test server working',
    received: req.body 
  });
});

app.listen(3002, () => {
  console.log('✅ Test server running on port 3002');
});
