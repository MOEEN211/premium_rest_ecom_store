import nodemailer from 'nodemailer';

console.log('Testing Gmail email service as backup...');

// Using Gmail as test (you'll need to enable 2FA and app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com', // Replace with your Gmail
    pass: 'your-app-password' // Replace with Gmail app password
  }
});

async function testGmailEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Elitebed Test" <yourgmail@gmail.com>`,
      to: 'moeenijaz211@gmail.com',
      subject: '🧪 TEST - Gmail Backup Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4a9d9c;">🧪 GMAIL TEST EMAIL</h2>
          <p>This is a test email sent via Gmail service.</p>
          <p><strong>If you receive this, we know Gmail works but your SMTP doesn't.</strong></p>
          <p>Time: ${new Date().toLocaleString()}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This tests if the issue is with your SMTP server.</p>
        </div>
      `
    });
    console.log('✅ SUCCESS: Gmail email sent to moeenijaz211@gmail.com');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Gmail FAILED:', err.message);
  }
}

testGmailEmail();
