import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("🔍 Step 1: Starting debug signup...");
        
        // Test 1: Can we read the request body?
        let body;
        try {
            body = await request.json();
            console.log("✅ Step 2: Request body parsed:", { name: body.name, email: body.email, password: "***" });
        } catch (e) {
            console.error("❌ Step 2 FAILED: Cannot parse request body:", e);
            return NextResponse.json({ error: "Invalid request body", step: "parse_body" }, { status: 400 });
        }
        
        // Test 2: Can we access environment variables?
        try {
            const envTest = {
                MONGODB_URI: !!process.env.MONGODB_URI,
                TOKEN_SECRET: !!process.env.TOKEN_SECRET,
            };
            console.log("✅ Step 3: Environment variables accessible:", envTest);
        } catch (e) {
            console.error("❌ Step 3 FAILED: Environment variables issue:", e);
            return NextResponse.json({ error: "Environment error", step: "env_check" }, { status: 500 });
        }
        
        // Test 3: Can we import database connection?
        try {
            console.log("✅ Step 4: Attempting database import...");
            const { dbconnect } = await import("@/dbConfig/dbConfig");
            console.log("✅ Step 4: Database module imported successfully");
            
            // Test 4: Can we connect to database?
            console.log("✅ Step 5: Attempting database connection...");
            await dbconnect();
            console.log("✅ Step 5: Database connected successfully");
        } catch (e) {
            console.error("❌ Step 4-5 FAILED: Database issue:", e);
            return NextResponse.json({ 
                error: "Database connection failed", 
                details: e instanceof Error ? e.message : "Unknown error",
                step: "database" 
            }, { status: 500 });
        }
        
        // Test 5: Can we import User model?
        try {
            console.log("✅ Step 6: Attempting User model import...");
            const User = (await import("@/models/user.models")).default;
            console.log("✅ Step 6: User model imported successfully");
            
            // Test 6: Can we query User model?
            const testQuery = await User.findOne({ email: "test@nonexistent.com" });
            console.log("✅ Step 7: User model query successful (result:", testQuery ? "found" : "not found", ")");
        } catch (e) {
            console.error("❌ Step 6-7 FAILED: User model issue:", e);
            return NextResponse.json({ 
                error: "User model failed", 
                details: e instanceof Error ? e.message : "Unknown error",
                step: "user_model" 
            }, { status: 500 });
        }
        
        // If we get here, everything works!
        return NextResponse.json({
            success: true,
            message: "All systems working! Database connection and User model are functional.",
            receivedData: { name: body.name, email: body.email },
            timestamp: new Date().toISOString()
        }, { status: 200 });
        
    } catch (error: any) {
        console.error("❌ CRITICAL ERROR in debug signup:", error);
        return NextResponse.json({
            error: "Critical failure",
            message: error.message || "Unknown error",
            stack: error.stack?.split('\n').slice(0, 3).join('\n'),
            step: "critical"
        }, { status: 500 });
    }
}