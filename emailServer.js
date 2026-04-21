import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Transporter configuration for Namecheap Private Email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.elitebed.co.uk',
  port: 465, // Use standard port 465 for SMTP SSL
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Namecheap Private Email often requires this for SSL handshakes
    rejectUnauthorized: false
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

app.post('/send-order-email', async (req, res) => {
  const { order_id, customer_details, order_items, total_price } = req.body;

  if (!customer_details || !order_items) {
    return res.status(400).json({ success: false, message: 'Missing order details' });
  }

  // Format order items for the email
  const itemsHtml = order_items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">£${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Elitebed.uk Orders" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order #${order_id || 'N/A'} - ${customer_details.fullName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #4a9d9c; text-align: center;">New Order Received!</h2>
        <p><strong>Order ID:</strong> ${order_id || 'N/A'}</p>
        
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Customer Details</h3>
        <p><strong>Name:</strong> ${customer_details.fullName}</p>
        <p><strong>Email:</strong> ${customer_details.email}</p>
        <p><strong>Phone:</strong> ${customer_details.phone}</p>
        <p><strong>Address:</strong> ${customer_details.address}</p>
        
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f9f9f9;">
              <th style="padding: 8px; text-align: left;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; font-weight: bold; text-align: right;">Total</td>
              <td style="padding: 8px; font-weight: bold; text-align: right;">£${total_price.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">
          This is an automated notification from Elitebed.co.uk
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order email sent for Order #${order_id}`);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

const PORT = process.env.EMAIL_SERVER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
});
