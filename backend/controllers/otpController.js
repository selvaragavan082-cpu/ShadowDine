import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client using API Key & Secret
const client = twilio(apiKey, apiSecret, { accountSid: accountSid });
const otpStore = {};

export const sendOTP = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber || req.body.phone;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const cleanPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/[^0-9]/g, "")}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await client.messages.create({
      body: `Your ShadowDine Verification Code is: ${otp}`,
      from: twilioNumber,
      to: cleanPhone
    });

    otpStore[cleanPhone] = otp;
    res.json({ success: true, message: "Real SMS OTP sent successfully!" });
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber || req.body.phone;
  const otp = req.body.otp;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP code are required" });
  }

  const cleanPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/[^0-9]/g, "")}`;

  if (otpStore[cleanPhone] && otpStore[cleanPhone] === otp) {
    delete otpStore[cleanPhone];
    return res.json({ success: true, message: "OTP Verified Successfully!" });
  }
  res.status(400).json({ success: false, message: "Invalid OTP Code!" });
};
