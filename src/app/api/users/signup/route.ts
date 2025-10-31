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
        console.log("User object details:", {
            username: newUser.username,
            email: newUser.email,
            hasPassword: !!newUser.password,
            isVerified: newUser.isVerified,
            collection: User.collection.name
        });
        
        console.log("🔍 STEP 6: Saving user to database...");
        console.log("MongoDB connection state:", {
            readyState: require('mongoose').connection.readyState,
            host: require('mongoose').connection.host,
            name: require('mongoose').connection.name
        });
        
        const savedUser = await newUser.save();
        console.log("✅ STEP 6: User saved to database with ID:", savedUser._id);
        console.log("Saved user details:", {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isVerified: savedUser.isVerified,
            createdAt: savedUser.createdAt
        });
        
        // Verify the user was actually saved
        console.log("🔍 STEP 6.5: Verifying user was saved...");
        const verifyUser = await User.findById(savedUser._id);
        if (!verifyUser) {
            console.error("❌ CRITICAL: User was NOT found after save!");
            throw new Error("User save verification failed");
        }
        console.log("✅ STEP 6.5: User verified in database");
        
        console.log("🔍 STEP 7: Attempting to send verification email...");
        try {
            const emailResult = await sendEmail({
                email: savedUser.email,
                emailtype: "VERIFY",
                userId: savedUser._id
            });
            console.log("✅ STEP 7: Verification email sent successfully");
            console.log("Email result:", emailResult);
        } catch (emailError) {
            console.error("❌ STEP 7: Email sending failed:", emailError);
            // Don't fail the signup if email fails
        }
        
        return NextResponse.json(
            { 
                message: "User created successfully! Please check your email for verification.", 
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
        
        // Handle MongoDB duplicate key errors
        if (error instanceof Error && error.message.includes('E11000 duplicate key error')) {
            let field = 'field';
            let value = '';
            
            if (error.message.includes('username_1')) {
                field = 'username';
                const match = error.message.match(/username: "([^"]+)"/);
                value = match ? match[1] : '';
            } else if (error.message.includes('email_1')) {
                field = 'email';
                const match = error.message.match(/email: "([^"]+)"/);
                value = match ? match[1] : '';
            }
            
            return NextResponse.json(
                { 
                    success: false,
                    message: `A user with this ${field} already exists. Please use a different ${field}.`,
                    field,
                    error: "DUPLICATE_KEY"
                },
                { status: 409 }
            );
        }
        
        // Return detailed error for other errors
        return NextResponse.json(
            { 
                success: false,
                message: "Signup failed - please try again", 
                error: {
                    name: error instanceof Error ? error.name : "Unknown",
                    message: error instanceof Error ? error.message : "Unknown error",
                    stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5).join('\n') : "No stack trace",
                    type: typeof error,
                    stringified: String(error)
                },
                timestamp: new Date().toISOString(),
                environment: {
                    NODE_ENV: process.env.NODE_ENV,
                    hasMongoURI: !!process.env.MONGODB_URI,
                    hasTokenSecret: !!process.env.TOKEN_SECRET
                }
            },
            { status: 500 }
        );
    }
}
