import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Guest User' },
  phone: { type: String, required: true, unique: true },
  email: { type: String, sparse: true, default: null },
  otp: { type: String },
  otpExpires: { type: Date },
  role: { 
    type: String, 
    enum: ['user', 'customer', 'admin'], // 👈 'user', 'customer', and 'admin' all allowed
    default: 'customer' 
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);