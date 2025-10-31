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

    // Check for critical missing variables only
    const criticalVars = ['MONGODB_URI', 'TOKEN_SECRET', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'];
    const missingCritical = criticalVars.filter(key => !process.env[key]);
    const allCriticalSet = missingCritical.length === 0;

    return NextResponse.json({
      success: allCriticalSet,
      message: allCriticalSet ? "All critical environment variables configured ✅" : `Missing critical variables: ${missingCritical.join(', ')}`,
      environment: envCheck,
      missingCritical,
      actualDomain: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'localhost',
      deploymentTime: new Date().toISOString(),
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