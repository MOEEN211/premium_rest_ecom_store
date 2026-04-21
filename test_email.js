import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('Testing SMTP with settings:');
console.log('User:', process.env.VITE_SMTP_USER);
console.log('To:', process.env.VITE_ADMIN_EMAIL);

const transporter = nodemailer.createTransport({
  host: 'mail.elitebed.co.uk',
  port: 465,
  secure: true,
  auth: {
    user: process.env.VITE_SMTP_USER,
    pass: process.env.VITE_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.VITE_SMTP_USER}>`,
      to: process.env.VITE_ADMIN_EMAIL,
      subject: 'Test Email',
      text: 'This is a test email.'
    });
    console.log('SUCCESS:', info.messageId);
  } catch (err) {
    console.error('FAILED:', err);
  }
}

test();
