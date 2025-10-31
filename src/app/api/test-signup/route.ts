import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("🔍 Starting signup test...");
        
        await dbconnect();
        console.log("✅ Database connected");
        
        const body = await request.json();
        const { name, email, password } = body;
        console.log("📨 Received data:", { name, email, password: "***" });
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ User already exists");
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
        console.log("✅ User doesn't exist, proceeding...");
        
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Password hashed");
        
        const newUser = new User({
            username: name,
            email,
            password: hashedPassword,
        });
        console.log("✅ User object created");
        
        const savedUser = await newUser.save();
        console.log("✅ User saved to database:", savedUser._id);
        
        return NextResponse.json(
            { 
                message: "User created successfully (no email sent for testing)", 
                user: { id: savedUser._id, email: savedUser.email, username: savedUser.username }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("❌ Error during signup test:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}