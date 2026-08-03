import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import API from './api';

// Setup invisible reCAPTCHA on the specified container
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA verified successfully:", response);
      },
      "expired-callback": () => {
        console.warn("reCAPTCHA expired, please try again.");
      }
    });
  }
  return window.recaptchaVerifier;
};

// Send OTP SMS to the given phone number (Format: +919876543210)
export const sendOTP = async (phoneNumber, containerId = "recaptcha-container") => {
  try {
    const appVerifier = setupRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult; // Save to global scope for easy access
    return confirmationResult;
  } catch (error) {
    console.error("Firebase Send OTP Error:", error);
    throw error;
  }
};

// Verify the OTP code entered by the user
export const verifyOTP = async (otpCode, confirmationResultObj = null) => {
  try {
    const confirmation = confirmationResultObj || window.confirmationResult;
    if (!confirmation) {
      throw new Error("No active OTP request found. Please request a new OTP.");
    }
    const result = await confirmation.confirm(otpCode);
    return result.user; // Returns authenticated user object
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