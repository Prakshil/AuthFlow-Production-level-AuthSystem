import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ 
      message: "API is working",
      timestamp: new Date().toISOString(),
      success: true 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      message: "API error",
      error: error.message,
      success: false 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: "POST received",
      receivedData: body,
      timestamp: new Date().toISOString(),
      success: true 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      message: "POST error",
      error: error.message,
      success: false 
    }, { status: 500 });
  }
}