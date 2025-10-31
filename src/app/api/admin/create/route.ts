import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// This is a one-time setup endpoint - delete after creating admin
export async function POST(request: NextRequest) {
    try {
        await dbconnect();
        
        const { email, password, name } = await request.json();
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json(
                { message: "Admin user already exists" },
                { status: 400 }
            );
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const admin = new User({
            username: name,
            email,
            password: hashedPassword,
            role: "admin",
            isVerified: true, // Auto-verify admin
        });
        
        await admin.save();
        
        return NextResponse.json(
            { 
                message: "Admin user created successfully!",
                admin: {
                    id: admin._id,
                    email: admin.email,
                    username: admin.username,
                    role: admin.role
                }
            },
            { status: 201 }
        );
        
    } catch (error: any) {
        console.error("Admin creation error:", error);
        return NextResponse.json(
            { message: "Failed to create admin user", error: error.message },
            { status: 500 }
        );
    }
}
