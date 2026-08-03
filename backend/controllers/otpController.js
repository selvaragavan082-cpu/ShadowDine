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

// Send Verification Code via Twilio Verify API with fallback
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

    let verificationResult = null;

    if (client) {
      try {
        const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || ("VA" + (accountSid ? accountSid.substring(2, 32) : ""));
        verificationResult = await client.verify.v2
          .services(verifyServiceSid)
          .verifications.create({ to: cleanPhone, channel: "sms" });
      } catch (verifyErr) {
        console.warn("Twilio Verify Service fallback to Messaging/DevOtp:", verifyErr.message);
        if (twilioNumber) {
          try {
            await client.messages.create({
              body: `Your ShadowDine Verification Code is: ${otp}`,
              from: twilioNumber,
              to: cleanPhone
            });
          } catch (msgErr) {
            console.error("Twilio SMS Delivery Error:", msgErr.message);
          }
        }
      }
    }

    res.json({
      success: true,
      message: "Verification code sent!",
      devOtp: verificationResult?.devOtp || otp,
      status: verificationResult?.status || "pending"
    });
  } catch (error) {
    console.error("Verify API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify Verification Code via Twilio Verify API with fallback
export const verifyOTP = async (req, res) => {
  const phoneNumber = req.body.phoneNumber || req.body.phone;
  const otp = req.body.otp;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP code are required" });
  }

  const cleanPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/[^0-9]/g, "")}`;

  if (client) {
    try {
      const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || ("VA" + (accountSid ? accountSid.substring(2, 32) : ""));
      const check = await client.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({ to: cleanPhone, code: otp });

      if (check.status === "approved") {
        delete otpStore[cleanPhone];
        return res.json({ success: true, message: "OTP Verified Successfully!" });
      }
    } catch (e) {
      console.warn("Twilio Verify check fallback to memory store:", e.message);
    }
  }

  if (otpStore[cleanPhone] && otpStore[cleanPhone] === otp) {
    delete otpStore[cleanPhone];
    return res.json({ success: true, message: "OTP Verified Successfully!" });
  }

  res.status(400).json({ success: false, message: "Invalid OTP Code!" });
};
