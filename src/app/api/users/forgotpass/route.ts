import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    
    const reqBody = await request.json();
    const { email } = reqBody;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send reset email with timeout protection
    try {
      const emailPromise = sendEmail({ email, emailtype: "RESET", userId: user._id });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout')), 10000)
      );
      
      await Promise.race([emailPromise, timeoutPromise]);
      console.log("✅ Reset email sent successfully");
    } catch (emailError) {
      console.error("⚠️  Reset email sending failed:", emailError);
      return NextResponse.json({ 
        error: "Failed to send reset email", 
        details: emailError instanceof Error ? emailError.message : "Unknown error"
      }, { status: 500 });
    }

    return NextResponse.json({
      message: "Password reset email sent successfully",
      success: true
    });

  } catch (error: any) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json({ 
      error: "Failed to send reset email", 
      details: error.message 
    }, { status: 500 });
  }
}