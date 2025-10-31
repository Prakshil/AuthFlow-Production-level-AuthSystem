import nodemailer from "nodemailer";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { env } from '@/utils/environment';

export const sendEmail = async ({ email, emailtype, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailtype === "VERIFY") {
      await User.findByIdAndUpdate(
        userId,
        { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 },
        { new: true, runValidators: true }
      );
    } else if (emailtype === "RESET") {
      await User.findByIdAndUpdate(
        userId,
        {
          forgotpasswordToken: hashedToken,
          forgotpasswordTokenExpiry: Date.now() + 3600000,
        },
        { new: true, runValidators: true }
      );
    }

    // Gmail SMTP Configuration - Environment Based
    const transport = nodemailer.createTransport(env.getEmailConfig());

    // Verify transporter
    try {
      await transport.verify();
    } catch (verifyError) {
      console.error("❌ Gmail connection failed:", verifyError);
      throw new Error("Gmail SMTP configuration error");
    }

    const verifyUrl = env.getVerifyUrl(hashedToken);
    const resetUrl = env.getResetUrl(hashedToken);

    const mailOptions = {
      from: env.EMAIL_FROM,
      to: email,
      subject: emailtype === "VERIFY" ? "🔐 Verify Your Email - Auth System" : "🔑 Reset Your Password - Auth System",
      html: emailtype === "VERIFY" 
        ? `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">🔐 Email Verification</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #4CAF50; margin-top: 0;">Welcome to Auth System!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">Thank you for registering! Please verify your email address to activate your account and start using our services.</p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verifyUrl}" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
                ✅ Verify Email Address
              </a>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Or copy and paste this link in your browser:<br>
              <span style="color: #4CAF50; word-break: break-all;">${verifyUrl}</span>
            </p>
            <div style="background: #333; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: #888;">
                ⏰ This verification link will expire in <strong style="color: #4CAF50;">1 hour</strong><br>
                🔒 If you didn't create this account, please ignore this email
              </p>
            </div>
          </div>
        </div>`
        : `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">🔑 Password Reset</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #f44336; margin-top: 0;">Reset Your Password</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">You requested to reset your password. Click the button below to create a new password for your account.</p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);">
                🔐 Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 30px;">
              Or copy and paste this link in your browser:<br>
              <span style="color: #f44336; word-break: break-all;">${resetUrl}</span>
            </p>
            <div style="background: #333; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="margin: 0; font-size: 14px; color: #888;">
                ⏰ This reset link will expire in <strong style="color: #f44336;">1 hour</strong><br>
                🔒 If you didn't request this, please ignore this email - your password won't be changed
              </p>
            </div>
          </div>
        </div>`
    };

    const result = await transport.sendMail(mailOptions);
    return result;

  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
