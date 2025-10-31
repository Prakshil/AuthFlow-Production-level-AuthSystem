import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";

export async function POST(request: NextRequest) {
    try {
        console.log("🔍 Starting signup process...");
        console.log("Environment check:", {
            NODE_ENV: process.env.NODE_ENV,
            MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
            TOKEN_SECRET: process.env.TOKEN_SECRET ? "✅ Set" : "❌ Missing",
            SMTP_HOST: process.env.SMTP_HOST ? "✅ Set" : "❌ Missing",
            SMTP_USER: process.env.SMTP_USER ? "✅ Set" : "❌ Missing",
        });
        
        await dbconnect();
        console.log("✅ Database connected successfully");
        
        const body = await request.json();
        const { name, email, password } = body;
        console.log("📨 Received signup data:", { name, email, password: "***" });
        
        // Validate input
        if (!name || !email || !password) {
            console.log("❌ Missing required fields");
            return NextResponse.json(
                { message: "Name, email and password are required" },
                { status: 400 }
            );
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ User already exists");
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
        console.log("✅ User doesn't exist, proceeding with creation");
        
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Password hashed successfully");
        
        const newUser = new User({
            username: name,
            email,
            password: hashedPassword,
            isVerified: false, // Set back to false for email verification
        });
        console.log("✅ User object created");
        
        const savedUser = await newUser.save();
        console.log("✅ User saved to database with ID:", savedUser._id);
        
        // Send verification email with timeout protection
        try {
            console.log("📧 Attempting to send verification email...");
            const emailPromise = sendEmail({ email, emailtype: "VERIFY", userId: savedUser._id });
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Email timeout after 10 seconds')), 10000)
            );
            
            await Promise.race([emailPromise, timeoutPromise]);
            console.log("✅ Verification email sent successfully");
            
            return NextResponse.json(
                { 
                    message: "User created successfully! Please check your email to verify your account.", 
                    user: { 
                        id: savedUser._id, 
                        email: savedUser.email, 
                        username: savedUser.username 
                    }
                },
                { status: 201 }
            );
            
        } catch (emailError) {
            console.error("⚠️  Email sending failed:", emailError);
            // Return success even if email fails - don't let email errors break signup
            return NextResponse.json(
                { 
                    message: "User created successfully! Email verification may have failed, but you can try logging in.", 
                    user: { 
                        id: savedUser._id, 
                        email: savedUser.email, 
                        username: savedUser.username 
                    },
                    emailError: emailError instanceof Error ? emailError.message : "Unknown email error"
                },
                { status: 201 }
            );
        }
        
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
