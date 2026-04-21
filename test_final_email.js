import nodemailer from 'nodemailer';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('📧 Testing with hardcoded credentials from server...');

const transporter = nodemailer.createTransport({
  host: 'mail.elitebed.co.uk',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@elitebed.co.uk', // From server.js
    pass: 'T5L(*[W)i4.-', // From server.js
  },
  tls: {
    rejectUnauthorized: false,
  }
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Elitebed Test" <admin@elitebed.co.uk>`,
      to: 'moeenijaz211@gmail.com',
      subject: '🧪 FINAL TEST - Elitebed Email System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <h2 style="color: #4a9d9c;">🧪 FINAL TEST EMAIL</h2>
          <p>This is the FINAL test email using the exact credentials from your server!</p>
          <p><strong>From:</strong> admin@elitebed.co.uk</p>
          <p><strong>To:</strong> moeenijaz211@gmail.com</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <div style="background-color: #e8f5e8; padding: 15px; margin-top: 20px; border-left: 4px solid #4a9d9c;">
            <h3 style="color: #155724; margin-top: 0;">✅ SUCCESS!</h3>
            <p>If you receive this email, your Elitebed email system is working perfectly!</p>
            <p>The system is ready to send order notifications when customers place orders.</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ SUCCESS: Email sent to moeenijaz211@gmail.com!');
    console.log('Message ID:', info.messageId);
    console.log('📬 Check your inbox now!');
    
  } catch (err) {
    console.error('❌ FAILED:', err.message);
    console.error('Full error:', err);
  }
}

sendTestEmail();
