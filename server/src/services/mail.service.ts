import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const clientBaseUrl = env.corsOrigins[0] || 'http://localhost:5173';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
});

export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<void> => {
  const verifyUrl = `${clientBaseUrl}/verify-email?token=${token}`;

  const textContent = `Hello ${name},\n\nPlease verify your email address for your Hallmarq account by visiting the link below:\n\n${verifyUrl}\n\nThis link is valid for 24 hours.\n\nThank you,\nThe Hallmarq Team`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0F172A;">
      <h2 style="color: #0D9488;">Verify your email address</h2>
      <p>Hello ${name},</p>
      <p>Please confirm your email address for your Hallmarq account by clicking the button below:</p>
      <div style="margin: 24px 0;">
        <a href="${verifyUrl}" style="background-color: #0D9488; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">Verify email address</a>
      </div>
      <p style="color: #64748B; font-size: 14px;">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to: email,
      subject: 'Verify your Hallmarq email address',
      text: textContent,
      html: htmlContent
    });
  } catch (err) {
    logger.error({ err, email }, 'Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (email: string, name: string, token: string): Promise<void> => {
  const resetUrl = `${clientBaseUrl}/reset-password?token=${token}`;

  const textContent = `Hello ${name},\n\nYou requested a password reset for your Hallmarq account. Visit the link below to set a new password:\n\n${resetUrl}\n\nThis link is valid for 30 minutes.\n\nIf you did not request this, please ignore this email.\n\nThank you,\nThe Hallmarq Team`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0F172A;">
      <h2 style="color: #0D9488;">Reset your Hallmarq password</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the button below to choose a new password:</p>
      <div style="margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #0D9488; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">Reset password</a>
      </div>
      <p style="color: #64748B; font-size: 14px;">This link will expire in 30 minutes. If you did not request a password reset, no action is required.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to: email,
      subject: 'Reset your Hallmarq password',
      text: textContent,
      html: htmlContent
    });
  } catch (err) {
    logger.error({ err, email }, 'Failed to send password reset email');
  }
};
