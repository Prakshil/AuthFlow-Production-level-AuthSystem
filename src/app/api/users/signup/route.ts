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
        });
       const savedUser = await newUser.save();
       
       // Send verification email (with timeout protection)
       try {
           const emailPromise = sendEmail({ email, emailtype: "VERIFY", userId: savedUser._id });
           const timeoutPromise = new Promise((_, reject) => 
               setTimeout(() => reject(new Error('Email timeout')), 10000)
           );
           
           await Promise.race([emailPromise, timeoutPromise]);
           console.log("✅ Verification email sent successfully");
       } catch (emailError) {
           console.error("⚠️  Email sending failed:", emailError);
           // Continue with signup even if email fails
       }
       
        return NextResponse.json(
            { message: "User created successfully. Please check your email to verify your account.", user: savedUser },
            { status: 201 }
            
        );
    } catch (error) {
        console.error("Error during user signup:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
