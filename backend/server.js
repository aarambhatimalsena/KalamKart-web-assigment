import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import couponRoutes from './routes/couponRoutes.js';

// Load env variables and connect to DB
dotenv.config();
connectDB();

// Initialize app
const app = express();

// Fix CORS for frontend connection (IMPORTANT!)
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend from Vite dev server
  credentials: true                // Allow cookies if needed
}));

//  Parse incoming JSON
app.use(express.json());

//  API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/otp', otpRoutes); // 🔁 Changed path from '/users' to '/otp' to avoid conflict
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);

//  Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
