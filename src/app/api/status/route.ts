import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple check - just verify critical variables exist
    const critical = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      TOKEN_SECRET: !!process.env.TOKEN_SECRET,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_USER: !!process.env.SMTP_USER,
    };

    const allGood = Object.values(critical).every(Boolean);

    return NextResponse.json({
      success: allGood,
      message: allGood ? "✅ All critical variables set!" : "❌ Missing critical variables",
      variables: critical,
      ready: allGood,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}