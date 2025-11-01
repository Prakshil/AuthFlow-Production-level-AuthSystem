import { dbconnect } from "@/dbConfig/dbConfig";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDatafromToken";

export async function POST(request: NextRequest) {
    try {
        await dbconnect();
        
        // Get current user from token
        const currentUserId = await getDataFromToken(request);
        const currentUser = await User.findById(currentUserId).select("email role");
        
        // Check if current user is the main admin (your account)
        if (!currentUser || currentUser.email !== "prakshilmpatel@gmail.com" || currentUser.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized. Only the main admin can assign roles." },
                { status: 403 }
            );
        }
        
        const { userId, newRole } = await request.json();
        
        if (!userId || !newRole) {
            return NextResponse.json(
                { message: "User ID and role are required" },
                { status: 400 }
            );
        }
        
        if (!['admin', 'user'].includes(newRole)) {
            return NextResponse.json(
                { message: "Invalid role. Must be 'admin' or 'user'" },
                { status: 400 }
            );
        }
        
        // Find and update user role
        const userToUpdate = await User.findById(userId);
        
        if (!userToUpdate) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        
        // Prevent changing own role
        if (userToUpdate._id.toString() === currentUserId) {
            return NextResponse.json(
                { message: "You cannot change your own role" },
                { status: 400 }
            );
        }
        
        userToUpdate.role = newRole;
        await userToUpdate.save();
        
        return NextResponse.json(
            { 
                success: true,
                message: `User role updated to ${newRole} successfully`,
                user: {
                    id: userToUpdate._id,
                    email: userToUpdate.email,
                    username: userToUpdate.username,
                    role: userToUpdate.role
                }
            },
            { status: 200 }
        );
        
    } catch (error: any) {
        console.error("Update role error:", error);
        return NextResponse.json(
            { message: "Failed to update user role", error: error.message },
            { status: 500 }
        );
    }
}
