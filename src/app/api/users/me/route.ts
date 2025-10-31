import { getDataFromToken } from "@/utils/getDatafromToken";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import User from "@/models/user.models";
import { dbconnect } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        await dbconnect();
        
        const userId = getDataFromToken(request);
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: "User data fetched successfully",
            data: user,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}