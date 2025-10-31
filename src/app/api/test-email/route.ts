import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("🧪 Testing email to:", email);
    
    // Create a fake user ID for testing
    const testUserId = "507f1f77bcf86cd799439011";
    
    await sendEmail({ 
      email, 
      emailtype: "VERIFY", 
      userId: testUserId 
    });
    
    return NextResponse.json({ 
      message: "Test email sent successfully!",
      success: true 
    });
    
  } catch (error: any) {
    console.error("❌ Test email failed:", error);
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error.message 
    }, { status: 500 });
  }
}