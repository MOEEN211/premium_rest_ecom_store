import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.VITE_EMAIL_SERVER_PORT || 3001;

console.log(`🌐 Email server starting on port ${PORT}...`);

const transporter = nodemailer.createTransport({
  host: 'mail.elitebed.co.uk',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@elitebed.co.uk', // Correct username
    pass: 'T5L(*[W)i4.-', // Correct password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

console.log('Transporter initialized with host:', transporter.options.host);

app.use((req, res, next) => {
  console.log(`📧 ${req.method} ${req.url}`);
  console.log('📊 Headers:', req.headers);
  next();
});

app.post('/send-email', async (req, res) => {
  console.log('📧 Received POST request to /send-email');
  console.log('📊 Request headers:', req.headers);
  console.log('📊 Request body raw:', req.body);
  console.log('📊 Request body type:', typeof req.body);
  
  const { to, from, subject, html, order_items, customer_details, total } = req.body;

  // Handle both new format and old format
  const mailOptions = {
    from: from ? `"Elitebed.uk Order" <${from}>` : `"Elitebed.uk Orders" <${process.env.VITE_SMTP_USER}>`,
    to: to || 'sales@premiumrestfurniture.co.uk', // Send to your admin email
    subject: subject || `New Order from ${customer_details?.fullName || 'Customer'} (${customer_details?.email || 'N/A'})`,
    html: html || `<h1>New Order Received!</h1>
           <h3>Customer Details:</h3>
           <p><strong>Name:</strong> ${customer_details?.fullName || 'N/A'}</p>
           <p><strong>Email:</strong> ${customer_details?.email || 'N/A'}</p>
           <p><strong>Phone:</strong> ${customer_details?.phone || 'N/A'}</p>
           <p><strong>Address:</strong> ${customer_details?.address || 'N/A'}</p>
           <h3>Order Items:</h3>
           <pre>${JSON.stringify(order_items, null, 2)}</pre>
           <h3><strong>Total:</strong> ${total || 'N/A'}</h3>`,
  };

  try {
    console.log(`Attempting to send email to: ${mailOptions.to}`);
    console.log(`Email subject: ${mailOptions.subject}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    res.status(200).json({ success: true, message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('❌ FAILED to send email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
