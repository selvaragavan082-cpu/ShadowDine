import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (apiKey && apiSecret && accountSid) {
  try {
    client = twilio(apiKey, apiSecret, { accountSid: accountSid });
  } catch (e) {
    console.warn("Twilio client initialization error:", e.message);
  }
}

const otpStore = {};

export const sendOTP = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber || req.body.phone;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number required" });
    }

    const cleanPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/[^0-9]/g, "")}`;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[cleanPhone] = otp;

    console.log(`🔑 SHADOWDINE GENERATED OTP FOR ${cleanPhone}: ${otp}`);

    if (client && twilioNumber) {
      try {
        await client.messages.create({
          body: `Your ShadowDine Verification Code is: ${otp}`,
          from: twilioNumber,
          to: cleanPhone
        });
        return res.json({ success: true, message: "SMS Sent Successfully!", devOtp: otp });
      } catch (smsErr) {
        console.error("Twilio SMS Delivery Error:", smsErr.message);
        return res.json({ 
          success: true, 
          message: "OTP Generated (Console/Alert Fallback Active)", 
          devOtp: otp 
        });
      }
    } else {
      return res.json({ 
        success: true, 
        message: "OTP Generated (Console/Alert Fallback Active)", 
        devOtp: otp 
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
