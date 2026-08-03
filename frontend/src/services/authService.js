import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import API from './api';

export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA solved:", response);
      }
    });
  }
  return window.recaptchaVerifier;
};

export const sendOTP = async (phoneNumber, containerId = "recaptcha-container") => {
  try {
    const appVerifier = setupRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (confirmationResult, otpCode) => {
  try {
    const result = await confirmationResult.confirm(otpCode);
    return result.user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// API Helpers
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