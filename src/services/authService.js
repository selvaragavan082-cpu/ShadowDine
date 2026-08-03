import API from './api';

// Send Real SMS OTP via Twilio Backend
export const sendOTP = async (phoneNumber) => {
  try {
    const cleanNum = phoneNumber.replace(/[^0-9]/g, "");
    const formattedPhone = cleanNum.startsWith("91") && cleanNum.length === 12 
      ? `+${cleanNum}` 
      : `+91${cleanNum.slice(-10)}`;

    const res = await API.post('/otp/send-otp', { phoneNumber: formattedPhone, phone: formattedPhone });
    return res.data;
  } catch (error) {
    console.error("Twilio Real SMS Error:", error);
    throw error;
  }
};

// Verify Real SMS OTP via Twilio Backend
export const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const cleanNum = phoneNumber.replace(/[^0-9]/g, "");
    const formattedPhone = cleanNum.startsWith("91") && cleanNum.length === 12 
      ? `+${cleanNum}` 
      : `+91${cleanNum.slice(-10)}`;

    const res = await API.post('/otp/verify-otp', { phoneNumber: formattedPhone, phone: formattedPhone, otp: otpCode });
    return res.data;
  } catch (error) {
    console.error("Twilio Verify OTP Error:", error);
    throw error;
  }
};

// Backend Twilio API Helpers
export const sendOtpAPI = (phoneNumber) => sendOTP(phoneNumber);
export const verifyOtpAPI = (phoneNumber, otp) => verifyOTP(phoneNumber, otp);
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getCurrentUserAPI = () => API.get('/auth/me');

const authService = {
  sendOTP,
  verifyOTP,
  sendOtpAPI,
  verifyOtpAPI,
  loginAPI,
  registerAPI,
  getCurrentUserAPI,
};

export default authService;
