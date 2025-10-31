import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function getDataFromToken(request: NextRequest) {
    try {
        
        const token = request.cookies.get("token")?.value || "";
        const decoded:any = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
        return decoded.id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    } 
}    