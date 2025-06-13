import nodemailer from 'nodemailer';
import fs from 'fs';

// ✅ Order Confirmation or Invoice Email
export const sendOrderEmail = async (to, subject, text, invoicePath = null) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KalamKart 🛍️" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments: invoicePath ? [{ filename: 'Invoice.pdf', path: invoicePath }] : [],
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order email sent to:', to);
  } catch (err) {
    console.error('❌ Failed to send order email:', err.message);
  }
};

// ✅ OTP Email with Debug Logs
export const sendOtpEmail = async (to, otp) => {
  try {
    console.log("📩 Preparing to send OTP to:", to);
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KalamKart 🔐" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🔑 Your KalamKart OTP Code',
      html: `
        <h3>Hello 👋</h3>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</div>
        <p>This code is valid for 5 minutes.</p>
        <p>If you did not request this, please ignore.</p>
        <br/>
        <p>— Team KalamKart</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent to:', to);
    console.log('📨 Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send OTP email:', err.message);
  }
};

// ✅ Forgot Password Email
export const sendForgotPasswordEmail = async (to, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"KalamKart 🔒" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🔐 Password Reset Request',
      html: `
        <h3>Hello 👋</h3>
        <p>You requested to reset your KalamKart password.</p>
        <p>Click the button below to reset it:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, you can safely ignore it.</p>
        <br/>
        <p>— Team KalamKart</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', to);
  } catch (err) {
    console.error('❌ Failed to send password reset email:', err.message);
  }
};
