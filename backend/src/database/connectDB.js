import mongoose from "mongoose";
import { handleServerRestart } from "../utils/generateSchedule.js";
export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        // handleServerRestart();
        if (connection) console.log("Database has been connected");
    }
    catch (error) {
        console.log("[CONNECTION DATABASE ERROR]", error)
    }
}