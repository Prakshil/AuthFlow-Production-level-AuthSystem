import mongoose from "mongoose";

export async function dbconnect() {
    try {
        // Avoid multiple connections
        if (mongoose.connections[0].readyState) {
            console.log("Already connected to database");
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        const connection = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log("Connected to MongoDB successfully");
        
        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });

        return connection;
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}
