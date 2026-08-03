import API from './api';

export const sendOtpAPI = (data) => API.post('/auth/send-otp', data);
export const verifyOtpAPI = (data) => API.post('/auth/verify-otp', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getCurrentUserAPI = () => API.get('/auth/me');

const authService = {
  sendOtpAPI,
  verifyOtpAPI,
  loginAPI,
  registerAPI,
  getCurrentUserAPI,
};

export default authService;
