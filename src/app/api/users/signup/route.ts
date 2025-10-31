import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";
import { sendEmail } from "@/utils/mailer";

dbconnect();

export async function POST(request: NextRequest) {
    try {
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
       
       // Send verification email
       await sendEmail({ email, emailtype: "VERIFY", userId: savedUser._id });
       
        return NextResponse.json(
            { message: "User created successfully. Please check your email to verify your account.", user: savedUser },
            { status: 201 }
            
        );
    } catch (error) {
        console.error("Error during user signup:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
