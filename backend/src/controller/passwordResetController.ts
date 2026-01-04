import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/Users';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize Twilio client (optional - only if credentials are provided)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Initialize nodemailer transporter
const createEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Gmail app password
      },
    });
  } else if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return null;
};

// Request password reset - generates token and sends email/SMS
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry to user (30 minutes)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    // Send reset link via email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailTransporter = createEmailTransporter();

    if (emailTransporter) {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request - OpenHand Care',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8b5cf6;">Reset Your Password</h2>
            <p>Hi ${user.name},</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${resetUrl}</p>
            <p style="color: #666; font-size: 14px;">This link will expire in 30 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">OpenHand Care - Compassionate Care for Your Loved Ones</p>
          </div>
        `,
      };

      await emailTransporter.sendMail(mailOptions);
    }

    // If user has phone number and SMS is configured, send SMS too
    if (user.phoneNumber && twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `OpenHand Care: Your password reset code is: ${resetToken.substring(0, 8).toUpperCase()}. Visit ${process.env.FRONTEND_URL}/reset-password to reset your password. Expires in 30 min.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phoneNumber,
        });
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
        // Don't fail the request if SMS fails
      }
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
