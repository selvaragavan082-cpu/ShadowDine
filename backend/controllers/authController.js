import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// 1. Send OTP Controller
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log('\n==============================================');
    console.log('📲 [SMS GATEWAY SIMULATOR]');
    console.log(`Phone Number : +91 ${phone}`);
    console.log(`Generated OTP: ${otp}`);
    console.log(`Timestamp    : ${new Date().toLocaleString()}`);
    console.log('==============================================\n');

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 2. Verify OTP & Register/Login Controller
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;
    const user = await User.findOne({ phone });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or Expired OTP' });
    }

    // Email duplication check
    if (email) {
      const existingEmailUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingEmailUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'This email is already registered with another mobile number!' 
        });
      }
      user.email = email;
    }

    if (name) user.name = name;

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role || 'user' },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Authentication Successful!',
      token,
      user: { id: user._id, name: user.name || 'User', phone: user.phone, email: user.email, role: user.role }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This Email or Phone Number is already registered!'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};