import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import API from './api';

export const setupRecaptcha = (containerId = "recaptcha-container") => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`reCAPTCHA container with id "${containerId}" not found in DOM.`);
    return null;
  }

  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch (e) {}
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "normal",
    callback: (response) => {
      console.log("reCAPTCHA verified, sending SMS code now...");
    }
  });

  return window.recaptchaVerifier;
};

export const sendOTP = async (phoneNumber) => {
  try {
    const container = document.getElementById("recaptcha-container");
    if (!container) {
      console.warn("reCAPTCHA container element not ready in DOM.");
      return null;
    }

    const cleanNum = phoneNumber.replace(/[^0-9]/g, "");
    const formattedPhone = cleanNum.startsWith("91") && cleanNum.length === 12 
      ? `+${cleanNum}` 
      : `+91${cleanNum.slice(-10)}`;

    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch(e) {}
      window.recaptchaVerifier = null;
    }

    // Explicitly rendered Visible Recaptcha Box with safety checks
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "normal",
      callback: (response) => {
        console.log("reCAPTCHA verified, sending SMS code now...");
      }
    });

    if (window.recaptchaVerifier && typeof window.recaptchaVerifier.render === 'function') {
      await window.recaptchaVerifier.render();
    }

    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Firebase Real SMS Error Details:", error);
    throw error;
  }
};

export const verifyOTP = async (otpCode) => {
  if (!window.confirmationResult) {
    throw new Error("No active OTP request found.");
  }
  const result = await window.confirmationResult.confirm(otpCode);
  return result.user;
};

// Backend API Helpers
export const sendOtpAPI = (phoneNumber) => API.post('/otp/send-otp', { phoneNumber, phone: phoneNumber });
export const verifyOtpAPI = (phoneNumber, otp) => API.post('/otp/verify-otp', { phoneNumber, phone: phoneNumber, otp });
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
