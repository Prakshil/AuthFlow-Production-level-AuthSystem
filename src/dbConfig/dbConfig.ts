import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function dbconnect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Connected to the database");
        });
        connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}
