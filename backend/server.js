import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import otpRoutes from './routes/otpRoutes.js';

dotenv.config();

const app = express();

// CORS Configuration for Render / External Domain Deployment
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use('/api/otp', otpRoutes);

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

connectDB();