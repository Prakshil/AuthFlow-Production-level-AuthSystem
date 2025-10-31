import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";
import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Starting comprehensive email test...");
    
    await dbconnect();
    console.log("✅ Database connected");
    
    const { email, emailtype = "VERIFY" } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log(`📧 Testing email to: ${email}, type: ${emailtype}`);
    
    // Create or find a test user
    let testUser = await User.findOne({ email });
    if (!testUser) {
      testUser = new User({
        username: "Test User",
        email,
        password: "dummyhashedpassword",
        isVerified: false
      });
      await testUser.save();
      console.log("✅ Test user created");
    } else {
      console.log("✅ Found existing test user");
    }
    
    const result = await sendEmail({
      email,
      emailtype,
      userId: testUser._id
    });
    
    console.log("✅ Email test completed successfully");
    
    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      result,
      testUser: {
        id: testUser._id,
        email: testUser.email,
        verifyToken: testUser.verifyToken ? "Set" : "Not set"
      }
    });
    
  } catch (error: any) {
    console.error("❌ Test email failed:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to send test email",
      details: {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email test endpoint",
    usage: "POST with { email: 'test@example.com', emailtype: 'VERIFY' or 'RESET' }"
  });
}