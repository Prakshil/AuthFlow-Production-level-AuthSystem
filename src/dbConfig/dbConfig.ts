import mongoose from "mongoose";

export async function dbconnect() {
    try {
        // Check if already connected
        if (mongoose.connections[0].readyState === 1) {
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }
        
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        
        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });

        return connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}
