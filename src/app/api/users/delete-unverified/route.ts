import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await dbconnect();
        
        const { email } = await request.json();
        
        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }
        
        // Find and delete unverified user
        const user = await User.findOne({ email, isVerified: false });
        
        if (!user) {
            return NextResponse.json(
                { message: "No unverified user found with this email" },
                { status: 404 }
            );
        }
        
        await User.findByIdAndDelete(user._id);
        
        return NextResponse.json(
            { 
                success: true,
                message: "Unverified account deleted. You can now sign up again." 
            },
            { status: 200 }
        );
        
    } catch (error: any) {
        console.error("Delete unverified user error:", error);
        return NextResponse.json(
            { message: "Failed to delete unverified account", error: error.message },
            { status: 500 }
        );
    }
}
