import { dbconnect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbconnect();
    return NextResponse.json({ 
      message: "Database connection successful",
      success: true 
    }, { status: 200 });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      message: "Database connection failed",
      error: error.message,
      success: false 
    }, { status: 500 });
  }
}