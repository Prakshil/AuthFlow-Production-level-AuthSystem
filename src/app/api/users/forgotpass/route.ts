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

    await sendEmail({ email, emailtype: "RESET", userId: user._id });

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