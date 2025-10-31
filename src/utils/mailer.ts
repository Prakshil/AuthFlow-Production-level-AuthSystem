import nodemailer from "nodemailer";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { env } from '@/utils/environment';

export const sendEmail = async ({ email, emailtype, userId }: any) => {
  try {
    console.log(`📧 Starting email process for ${emailtype} to ${email}`);
    
    // Generate token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    console.log("✅ Token generated successfully");

    // Update user with token
    if (emailtype === "VERIFY") {
      console.log("🔍 Updating user with verification token...");
      await User.findByIdAndUpdate(
        userId,
        { 
          verifyToken: hashedToken, 
          verifyTokenExpiry: Date.now() + 3600000 // 1 hour
        },
        { new: true, runValidators: true }
      );
      console.log("✅ User updated with verification token");
    } else if (emailtype === "RESET") {
      console.log("🔍 Updating user with reset token...");
      await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordExpiry: Date.now() + 3600000, // 1 hour
        },
        { new: true, runValidators: true }
      );
      console.log("✅ User updated with reset token");
    }

    // Gmail SMTP Configuration - Direct Config
    console.log("🔍 Creating email transporter...");
    const transportConfig = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false, // false for 587, true for 465
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    };
    
    const transport = nodemailer.createTransport(transportConfig);
    console.log("✅ Email transporter created");

    // Verify transporter
    try {
      console.log("🔍 Testing SMTP connection...");
      await transport.verify();
      console.log("✅ SMTP connection verified");
    } catch (verifyError) {
      console.error("❌ Gmail connection failed:", verifyError);
      throw new Error("Gmail SMTP configuration error");
    }

    // Generate URLs directly
    const verifyUrl = `${env.DOMAIN}/verifyemail?token=${hashedToken}`;
    const resetUrl = `${env.DOMAIN}/resetpassword?token=${hashedToken}`;
    
    console.log(`🔗 Generated URL: ${emailtype === "VERIFY" ? verifyUrl : resetUrl}`);

    const mailOptions = {
      from: env.EMAIL_FROM,
      to: email,
      subject: emailtype === "VERIFY" ? "🔐 Verify Your Email - Auth System" : "🔑 Reset Your Password - Auth System",
      html: emailtype === "VERIFY" 
        ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; border-radius: 10px; padding: 20px;">
          <div style="background: #4CAF50; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; color: white; font-size: 24px;">🔐 Email Verification</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #4CAF50;">Welcome to Auth System!</h2>
            <p style="font-size: 16px; color: #e0e0e0;">Please verify your email address to activate your account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                ✅ Verify Email
              </a>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 20px;">
              Link: <span style="color: #4CAF50;">${verifyUrl}</span><br>
              ⏰ Expires in 1 hour | 🔒 Ignore if you didn't sign up
            </p>
          </div>
        </div>`
        : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; border-radius: 10px; padding: 20px;">
          <div style="background: #f44336; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; color: white; font-size: 24px;">🔑 Password Reset</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #f44336;">Reset Your Password</h2>
            <p style="font-size: 16px; color: #e0e0e0;">Click the button below to reset your password.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                🔐 Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 20px;">
              Link: <span style="color: #f44336;">${resetUrl}</span><br>
              ⏰ Expires in 1 hour | 🔒 Ignore if you didn't request this
            </p>
          </div>
        </div>`
    };

    console.log("🔍 Sending email...");
    const result = await transport.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      url: emailtype === "VERIFY" ? verifyUrl : resetUrl
    };

  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response
    });
    throw new Error(`Failed to send ${emailtype} email: ${error.message}`);
  }
};
