import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import API from './api';

export const setupRecaptcha = (containerId = "recaptcha-container") => {
  // Clear existing verifier if any to avoid duplication errors
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.log("Clearing old recaptcha");
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: (response) => {
      console.log("reCAPTCHA solved successfully");
    },
    "expired-callback": () => {
      console.warn("reCAPTCHA expired, please try again.");
    }
  });

  return window.recaptchaVerifier;
};

export const sendOTP = async (phoneNumber, containerId = "recaptcha-container") => {
  try {
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
    const appVerifier = setupRecaptcha(containerId);
    
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Firebase Send OTP Error:", error);
    // Reset recaptcha on error so user can retry immediately
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch(e){}
      window.recaptchaVerifier = null;
    }
    throw error;
  }
};

export const verifyOTP = async (otpCode, confirmationResultObj = null) => {
  try {
    const confirmation = confirmationResultObj || window.confirmationResult;
    if (!confirmation) {
      throw new Error("No active OTP session found.");
    }
    const result = await confirmation.confirm(otpCode);
    return result.user;
  } catch (error) {
    console.error("Firebase Verify OTP Error:", error);
    throw error;
  }
};

// Backend API Helpers
export const sendOtpAPI = (data) => API.post('/auth/send-otp', data);
export const verifyOtpAPI = (data) => API.post('/auth/verify-otp', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getCurrentUserAPI = () => API.get('/auth/me');

const authService = {
  setupRecaptcha,
  sendOTP,
  verifyOTP,
  sendOtpAPI,
  verifyOtpAPI,
  loginAPI,
  registerAPI,
  getCurrentUserAPI,
};

export default authService;
