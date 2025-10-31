import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDatafromToken";

export async function GET(request: NextRequest) {
    try {
        await dbconnect();
        
        // Get user from token
        const userId = await getDataFromToken(request);
        const currentUser = await User.findById(userId).select("role");
        
        // Check if user is admin
        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }
        
        // Get all users with selected fields
        const users = await User.find()
            .select("username email role isVerified createdAt updatedAt")
            .sort({ createdAt: -1 });
        
        // Get statistics
        const totalUsers = users.length;
        const verifiedUsers = users.filter(u => u.isVerified).length;
        const unverifiedUsers = totalUsers - verifiedUsers;
        const adminUsers = users.filter(u => u.role === "admin").length;
        const regularUsers = users.filter(u => u.role === "user").length;
        
        return NextResponse.json({
            success: true,
            stats: {
                total: totalUsers,
                verified: verifiedUsers,
                unverified: unverifiedUsers,
                admins: adminUsers,
                regular: regularUsers
            },
            users
        });
        
    } catch (error: any) {
        console.error("Fetch users error:", error);
        return NextResponse.json(
            { message: "Failed to fetch users", error: error.message },
            { status: 500 }
        );
    }
}
