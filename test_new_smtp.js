import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.elitebed.co.uk',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@elitebed.co.uk',
    pass: 'fgA~kw&W*fc+',
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

console.log('Testing connection...');
transporter.verify((error, success) => {
  if (error) {
    console.log('Verification failed:');
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});
