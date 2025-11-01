import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbconnect();
    const reqBody = await request.json();
    const { token } = reqBody;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      // Try to find user with expired token to get email
      const expiredUser = await User.findOne({ verifyToken: token });
      return NextResponse.json({ 
        error: "Invalid or expired token",
        email: expiredUser?.email || null
      }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}