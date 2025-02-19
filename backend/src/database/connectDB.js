import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        const connection = await mongoose.connect(process.env.MONGO_URI);
        if (connection) console.log("Database has been connected");
    }
    catch (error) {
        console.log("[CONNECTION DATABASE ERROR]", error)
    }
}