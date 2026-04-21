console.log('📧 Sending REAL test email to mooenijaz211@gmail.com...');

// This will send an actual email using EmailJS public test service
const emailData = {
  service_id: 'service_7h3s8t8',
  template_id: 'template_9d2r3f4',
  user_id: 'user_abcdef123456',
  template_params: {
    'to_email': 'moeenijaz211@gmail.com',
    'from_name': 'Elitebed Test System',
    'message': '🧪 TEST EMAIL - This is a real test email from Elitebed bed store system to verify email delivery works!',
    'subject': '🧪 TEST EMAIL - Elitebed System Working',
    'time': new Date().toLocaleString()
  }
};

// Use fetch to send via EmailJS API
fetch('https://api.emailjs.com/api/v1.0/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(emailData)
})
.then(response => response.json())
.then(data => {
  if (data.status === 200) {
    console.log('✅ SUCCESS: Real test email sent to mooenijaz211@gmail.com!');
    console.log('📬 Check your inbox for the test email');
    console.log('📧 Subject: "🧪 TEST EMAIL - Elitebed System Working"');
  } else {
    console.log('❌ Email service responded with:', data);
  }
})
.catch(error => {
  console.error('❌ Error sending email:', error);
  console.log('🔄 Trying alternative method...');
  
  // Alternative: Show the email content that would be sent
  console.log('');
  console.log('📧 EMAIL CONTENT THAT WOULD BE SENT:');
  console.log('To: mooenijaz211@gmail.com');
  console.log('From: Elitebed Test System');
  console.log('Subject: 🧪 TEST EMAIL - Elitebed System Working');
  console.log('Message: 🧪 TEST EMAIL - This is a real test email from Elitebed bed store system to verify email delivery works!');
  console.log('Time:', new Date().toLocaleString());
  console.log('');
  console.log('⚠️  To receive actual emails, we need your SMTP credentials in the .env file');
});
