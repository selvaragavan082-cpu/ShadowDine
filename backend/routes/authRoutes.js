import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 1. SEND OTP ROUTE
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Generate random 6-digit OTP (100000 - 999999)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins validity

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone, otp: generatedOtp, otpExpires });
    } else {
      user.otp = generatedOtp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Console log for terminal output
    console.log('\n==============================================');
    console.log('📲 [SMS GATEWAY SIMULATOR]');
    console.log(`Phone Number : +91 ${phone}`);
    console.log(`Generated OTP: ${generatedOtp}`);
    console.log(`Timestamp    : ${new Date().toLocaleString()}`);
    console.log('==============================================\n');

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// 2. VERIFY OTP & REGISTER/LOGIN ROUTE
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name, role } = req.body;

    const user = await User.findOne({ phone });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or Expired OTP' });
    }

    // Update Name and Role
    if (name) user.name = name;
    if (role) {
      user.role = role === 'user' ? 'customer' : role;
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, phone: user.phone },
      process.env.JWT_SECRET || 'shadowdinesecret123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;