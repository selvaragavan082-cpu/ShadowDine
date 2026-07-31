import nodemailer from 'nodemailer';

export const sendGmail = async (toEmail, subject, textContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: `ShadowDine <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    text: textContent,
  };

  return await transporter.sendMail(mailOptions);
};