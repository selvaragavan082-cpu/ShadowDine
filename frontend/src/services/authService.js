import API from './api';

export const sendOtpAPI = (data) => API.post('/auth/send-otp', data);
export const verifyOtpAPI = (data) => API.post('/auth/verify-otp', data);
export const loginAPI = (data) => API.post('/auth/verify-otp', data);
export const registerAPI = (data) => API.post('/auth/verify-otp', data);