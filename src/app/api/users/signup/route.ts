import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";

export async function POST(request: NextRequest) {
    try {
        await dbconnect();
        
        const body = await request.json();
        const { name, email, password } = body;
        
        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email and password are required" },
                { status: 400 }
            );
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username: name,
            email,
            password: hashedPassword,
            isVerified: false,
        });
        
        const savedUser = await newUser.save();
        
        // Send verification email
        try {
            await sendEmail({
                email: savedUser.email,
                emailtype: "VERIFY",
                userId: savedUser._id
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
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
        console.error("Signup error:", error);
        
        // Handle MongoDB duplicate key errors
        if (error instanceof Error && error.message.includes('E11000 duplicate key error')) {
            let field = 'field';
            
            if (error.message.includes('username_1')) {
                field = 'username';
            } else if (error.message.includes('email_1')) {
                field = 'email';
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
        
        return NextResponse.json(
            { 
                success: false,
                message: "Signup failed - please try again",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
