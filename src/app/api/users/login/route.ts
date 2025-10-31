import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest,NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();


dbconnect();

export async function POST(request: NextRequest) {
    try {
        const rqBody = await request.json();
        const { email, password } = rqBody;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        
        // Check if user is verified
        if (!existingUser.isVerified) {
            return NextResponse.json(
                { message: "Please verify your email before logging in" },
                { status: 401 }
            );
        }
        
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        // proceed to create token and return it below

        // create the token and other stuff 
        const tokenData = {
            id: existingUser._id,
            userName: existingUser.username,
            email: existingUser.email
        }
        // generate token (JWT) here
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1h" });
        const response = NextResponse.json(
            { message: "Login successful", token },
            { status: 200 }
        );

        // accesing the cookie/token

        response.cookies.set("token", token, { 
            httpOnly: true,
        });

        return response;

        

    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
        
    }
}