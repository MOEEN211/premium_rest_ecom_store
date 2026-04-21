import nodemailer from 'nodemailer';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('Testing direct email to moeenijaz211@gmail.com...');

const transporter = nodemailer.createTransport({
  host: 'mail.elitebed.co.uk',
  port: 465,
  secure: true,
  auth: {
    user: 'orders@elitebed.co.uk', // Replace with your actual SMTP username
    pass: 'YourPassword123', // Replace with your actual SMTP password
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function testDirectEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Elitebed Test" <orders@elitebed.co.uk>`,
      to: 'moeenijaz211@gmail.com',
      subject: '🧪 TEST - Direct Email from Elitebed',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4a9d9c;">🧪 TEST EMAIL</h2>
          <p>This is a direct test email from Elitebed email server.</p>
          <p><strong>If you receive this, the email system works!</strong></p>
          <p>Time: ${new Date().toLocaleString()}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is a test email to verify email delivery.</p>
        </div>
      `
    });
    console.log('✅ SUCCESS: Email sent to moeenijaz211@gmail.com');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ FAILED:', err.message);
    console.error('Full error:', err);
  }
}

testDirectEmail();
