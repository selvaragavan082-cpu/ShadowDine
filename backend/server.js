import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 ShadowDine Backend API Running Successfully!');
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/restaurants', restaurantRoutes);

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shadowdine';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  });