import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";

export async function POST(request: NextRequest) {
    try {
        console.log("🔍 PRODUCTION DEBUG - Starting signup process...");
        console.log("Environment check:", {
            NODE_ENV: process.env.NODE_ENV,
            MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
            TOKEN_SECRET: process.env.TOKEN_SECRET ? "✅ Set" : "❌ Missing",
            SMTP_HOST: process.env.SMTP_HOST ? "✅ Set" : "❌ Missing",
            SMTP_USER: process.env.SMTP_USER ? "✅ Set" : "❌ Missing",
        });
        
        console.log("🔍 STEP 1: Attempting database connection...");
        await dbconnect();
        console.log("✅ STEP 1: Database connected successfully");
        
        console.log("🔍 STEP 2: Parsing request body...");
        const body = await request.json();
        const { name, email, password } = body;
        console.log("✅ STEP 2: Request parsed:", { name, email, password: "***" });
        
        // Validate input
        if (!name || !email || !password) {
            console.log("❌ STEP 3: Missing required fields");
            return NextResponse.json(
                { message: "Name, email and password are required" },
                { status: 400 }
            );
        }
        
        console.log("🔍 STEP 3: Checking if user exists...");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ STEP 3: User already exists");
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
        console.log("✅ STEP 3: User doesn't exist, proceeding with creation");
        
        console.log("🔍 STEP 4: Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ STEP 4: Password hashed successfully");
        
        console.log("🔍 STEP 5: Creating user object...");
        const newUser = new User({
            username: name,
            email,
            password: hashedPassword,
            isVerified: false, // Set back to false for email verification
        });
        console.log("✅ STEP 5: User object created");
        
        console.log("🔍 STEP 6: Saving user to database...");
        const savedUser = await newUser.save();
        console.log("✅ STEP 6: User saved to database with ID:", savedUser._id);
        
        // Skip email for now to isolate the core issue
        console.log("⚠️ STEP 7: Skipping email sending for debugging");
        
        return NextResponse.json(
            { 
                message: "User created successfully! (Email verification skipped for debugging)", 
                user: { 
                    id: savedUser._id, 
                    email: savedUser.email, 
                    username: savedUser.username 
                }
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("❌ CRITICAL ERROR in signup:", error);
        console.error("Error name:", error instanceof Error ? error.name : "Unknown");
        console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        
        // Provide detailed error information for debugging
        return NextResponse.json(
            { 
                message: "Signup failed", 
                error: error instanceof Error ? error.message : "Unknown error",
                errorType: error instanceof Error ? error.name : "Unknown",
                stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5).join('\n') : "No stack trace"
            },
            { status: 500 }
        );
    }
}
