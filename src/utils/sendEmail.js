import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject = '', message = '' } = {}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const messageOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject,
    text: message,
  };

  const info = await transporter.sendMail(messageOptions);

  console.log(`Email sent to ${email}: ${info.messageId}`);
};
