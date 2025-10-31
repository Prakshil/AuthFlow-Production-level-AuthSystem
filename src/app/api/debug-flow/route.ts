import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  const steps = [];
  
  try {
    // Step 1: Check environment variables
    steps.push({
      step: 1,
      name: "Environment Check",
      status: "checking",
      details: {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? "✅ Set" : "❌ Missing",
        TOKEN_SECRET: process.env.TOKEN_SECRET ? "✅ Set" : "❌ Missing",
        SMTP_HOST: process.env.SMTP_HOST ? "✅ Set" : "❌ Missing",
        SMTP_USER: process.env.SMTP_USER ? "✅ Set" : "❌ Missing",
        SMTP_PASS: process.env.SMTP_PASS ? "✅ Set" : "❌ Missing",
      }
    });
    
    // Step 2: Database connection
    steps.push({ step: 2, name: "Database Connection", status: "attempting" });
    await dbconnect();
    steps.push({ 
      step: 2, 
      name: "Database Connection", 
      status: "success",
      details: {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
    
    // Step 3: Parse request
    steps.push({ step: 3, name: "Parse Request", status: "attempting" });
    const body = await request.json();
    const { name, email, password } = body;
    steps.push({ 
      step: 3, 
      name: "Parse Request", 
      status: "success",
      data: { name, email, hasPassword: !!password }
    });
    
    // Step 4: Check existing user
    steps.push({ step: 4, name: "Check Existing User", status: "attempting" });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      steps.push({ step: 4, name: "Check Existing User", status: "found", userId: existingUser._id });
      return NextResponse.json({ success: true, steps, message: "User already exists" });
    }
    steps.push({ step: 4, name: "Check Existing User", status: "not_found" });
    
    // Step 5: Hash password
    steps.push({ step: 5, name: "Hash Password", status: "attempting" });
    const hashedPassword = await bcrypt.hash(password, 10);
    steps.push({ step: 5, name: "Hash Password", status: "success" });
    
    // Step 6: Create user object
    steps.push({ step: 6, name: "Create User Object", status: "attempting" });
    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    steps.push({ 
      step: 6, 
      name: "Create User Object", 
      status: "success",
      userObject: {
        username: newUser.username,
        email: newUser.email,
        hasPassword: !!newUser.password,
        isVerified: newUser.isVerified
      }
    });
    
    // Step 7: Save to database
    steps.push({ step: 7, name: "Save User to Database", status: "attempting" });
    const savedUser = await newUser.save();
    steps.push({ 
      step: 7, 
      name: "Save User to Database", 
      status: "success",
      userId: savedUser._id,
      details: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
        createdAt: savedUser.createdAt
      }
    });
    
    // Step 8: Verify save by reading back
    steps.push({ step: 8, name: "Verify User Saved", status: "attempting" });
    const verifyUser = await User.findById(savedUser._id);
    if (!verifyUser) {
      steps.push({ step: 8, name: "Verify User Saved", status: "failed" });
      throw new Error("User was not saved to database!");
    }
    steps.push({ 
      step: 8, 
      name: "Verify User Saved", 
      status: "success",
      verifiedUser: {
        id: verifyUser._id,
        username: verifyUser.username,
        email: verifyUser.email
      }
    });
    
    // Step 9: Count users in collection
    steps.push({ step: 9, name: "Count Users", status: "attempting" });
    const userCount = await User.countDocuments();
    steps.push({ step: 9, name: "Count Users", status: "success", count: userCount });
    
    return NextResponse.json({
      success: true,
      message: "Full debug flow completed successfully!",
      steps,
      finalUser: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser.isVerified
      }
    });
    
  } catch (error: any) {
    steps.push({
      step: "error",
      name: "Error Occurred",
      status: "failed",
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5).join('\n')
      }
    });
    
    return NextResponse.json({
      success: false,
      message: "Debug flow failed",
      steps,
      error: {
        name: error.name,
        message: error.message,
        code: error.code
      }
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbconnect();
    
    const userCount = await User.countDocuments();
    const users = await User.find().select('username email isVerified createdAt').limit(5);
    
    return NextResponse.json({
      message: "Debug Flow Endpoint",
      usage: "POST with { name, email, password } to test full signup flow",
      currentDatabase: {
        connected: mongoose.connection.readyState === 1,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections) : []
      },
      userCount,
      recentUsers: users
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      details: error
    }, { status: 500 });
  }
}
