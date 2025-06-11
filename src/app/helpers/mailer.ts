import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT || '2525'),
  auth: {
    user: process.env.EMAIL_USER || '44d0d2162b062f',
    pass: process.env.EMAIL_PASS || 'fb82d9f80a582e'
  }
});

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<{ success: boolean; message?: string; info?: any }> => {
  try {
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters');
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Sender Name" <sender@example.com>',
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, info };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
};