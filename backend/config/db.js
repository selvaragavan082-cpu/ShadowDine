import mongoose from 'mongoose';
import dns from 'dns';

// Set Google Public DNS to resolve MongoDB Atlas SRV records reliably
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('⚠️ Could not set custom DNS servers:', e.message);
}

const connectDB = async () => {
  const rawUri = process.env.MONGO_URI ? process.env.MONGO_URI.trim() : '';
  const MONGO_URI = rawUri || 'mongodb://127.0.0.1:27017/shadowdine';

  const mongooseOptions = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
    family: 4 // Force IPv4 to avoid IPv6 resolution delays on cloud hosts
  };

  try {
    const conn = await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log(`✅ Connected to MongoDB Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.warn('⚠️ Server will continue running without database connection. Non-DB features (like Gemini AI) remain operational.');
  }
};

export default connectDB;