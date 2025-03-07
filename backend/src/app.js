import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import { connectDB } from "./database/connectDB.js";
import authRoutes from './routes/authRoute.js';
import vendorRoutes from './routes/vendorOnBoardRoute.js'
import userRoute from './routes/userRoute.js'
import referralRoutes from './routes/referralRoutes.js'
import affiliateRoutes from './routes/affiliateRoute.js'
import adminRoutes from './routes/adminRoute.js'
import generateSig from './routes/generateSig.js'
import paymentRoute from './routes/PaymentRoute.js'
import checkForUserRoute from './routes/checkUserRoute.js'
import raffRoute from './routes/RaffRoutes.js'
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();


// app.use('/api/checkUser' , checkForUserRoute)
app.use('/api/auth', authRoutes); // rate limit
app.use('/api/users', userRoute);
app.use('/api/vendor',  vendorRoutes); //rate limit
app.use("/api/referral", referralRoutes);   
app.use("/api/affiliated", affiliateRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/generateSignature' , generateSig);
app.use('/api/payment' ,paymentRoute);
app.use('/api/Raff' ,raffRoute);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})