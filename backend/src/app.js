import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import { connectDB } from "./database/connectDB.js";
import { Server } from 'socket.io'
import http from 'http';
import authRoutes from './routes/authRoute.js';
import vendorRoutes from './routes/vendorOnBoardRoute.js'
import userRoute from './routes/userRoute.js'
import referralRoutes from './routes/referralRoutes.js'
import affiliateRoutes from './routes/affiliateRoute.js'
import adminRoutes from './routes/adminRoute.js'
import generateSig from './routes/generateSig.js'
import paymentRoute from './routes/PaymentRoute.js'

import raffRoute from './routes/RaffRoutes.js'
import wheelRoute from './routes/wheelRoutes.js'
import timeRoutes from "./routes/timeRoute.js"; 
const FRONTEND_URL = process.env.FRONTEND_URL;
dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json())

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL, //check again cuz i changed it while testing on local 
        methods: ["GET", "POST", "PUT"]
    }
});
;
app.locals.io = io

connectDB();


// app.use('/api/checkUser' , checkForUserRoute)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoute);
app.use('/api/vendor', vendorRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/affiliated", affiliateRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/generateSignature', generateSig);
app.use('/api/payment', paymentRoute);
app.use('/api/Raff', raffRoute);
app.use('/api/wheel', wheelRoute);
app.use("/api/time", timeRoutes); 
io.on("connection", (socket) => {
    try {
        console.log("User connected: ", socket.id);
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    } catch (error) {
        console.error("Socket error:", error);
    }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export { io };