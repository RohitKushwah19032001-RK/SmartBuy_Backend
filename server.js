import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()
import cookieParser from "cookie-parser";
import shopRoutes from "./routes/shopRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reelRoutes from "./routes/reelRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";
import dns from 'dns'

dns.setServers(["1.1.1.1","8.8.8.8"])


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://smart-buy-frontend-liard.vercel.app"
  ],
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err=> console.log(err));

app.get("/", (req,res)=>{
 res.send("API Running on 9630");
});

// shop
app.use("/api/shop", shopRoutes);
app.use('/api/product', productRoutes)
app.use("/api/order",orderRoutes);
app.use("/api/reel", reelRoutes);

// customer
app.use("/api/user",userRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/payment",paymentRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
 console.log("Server running on port", PORT);
});