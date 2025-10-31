import mongoose from "mongoose";

export async function dbconnect() {
    try {
        // Check if already connected
        if (mongoose.connections[0].readyState === 1) {
            console.log("✅ Already connected to database");
            console.log("Connection details:", {
                host: mongoose.connection.host,
                name: mongoose.connection.name,
                readyState: mongoose.connection.readyState
            });
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        console.log("🔍 Connecting to MongoDB...");
        console.log("MongoDB URI:", process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
        
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log("✅ Connected to MongoDB successfully");
        console.log("Connection details:", {
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            readyState: mongoose.connection.readyState,
            collections: Object.keys(mongoose.connection.collections)
        });
        
        mongoose.connection.on("error", (error) => {
            console.error("❌ MongoDB connection error:", error);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

        return connection;
    } catch (error) {
        console.error("❌ Error connecting to the database:", error);
        throw error;
    }
}
