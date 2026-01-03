import nodemailer from 'nodemailer';

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
  // 1. Create a transporter
  // For development, you can use Mailtrap.io or a Gmail App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use an "App Password," not your real password
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"Open Hand Care" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Actually send the email
  await transporter.sendEmail(mailOptions);
};

export default sendEmail;
