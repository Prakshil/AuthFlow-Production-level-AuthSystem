import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV || "❌ Not set",
      MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
      TOKEN_SECRET: process.env.TOKEN_SECRET ? "✅ Set" : "❌ Missing",
      SMTP_HOST: process.env.SMTP_HOST ? "✅ Set" : "❌ Missing",
      SMTP_USER: process.env.SMTP_USER ? "✅ Set" : "❌ Missing",
      SMTP_PASS: process.env.SMTP_PASS ? "✅ Set" : "❌ Missing",
      EMAIL_FROM: process.env.EMAIL_FROM ? "✅ Set" : "❌ Missing",
      VERCEL_URL: process.env.VERCEL_URL || "❌ Not set",
      PRODUCTION_DOMAIN: process.env.PRODUCTION_DOMAIN || "❌ Not set",
    };

    const allSet = Object.values(envCheck).every(value => value.includes("✅"));

    return NextResponse.json({
      success: allSet,
      message: allSet ? "All environment variables configured" : "Some environment variables missing",
      environment: envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}