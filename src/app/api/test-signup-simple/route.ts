import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("🧪 Testing signup without email...");
        
        // Test database connection
        await dbconnect();
        console.log("✅ Database connected");
        
        const body = await request.json();
        const { name, email, password } = body;
        console.log("📨 Received:", { name, email, password: "***" });
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Password hashed");
        
        // Create user
        const newUser = new User({
            username: name,
            email,
            password: hashedPassword,
            isVerified: true, // Skip email verification for testing
        });
        
        // Save user
        const savedUser = await newUser.save();
        console.log("✅ User saved:", savedUser._id);
        
        return NextResponse.json({
            message: "Test signup successful (no email sent)",
            user: {
                id: savedUser._id,
                email: savedUser.email,
                username: savedUser.username
            }
        }, { status: 201 });
        
    } catch (error: any) {
        console.error("❌ Test signup failed:", error);
        return NextResponse.json({
            message: "Test signup failed",
            error: error.message,
            type: error.name,
            stack: error.stack?.split('\n').slice(0, 3).join('\n')
        }, { status: 500 });
    }
}