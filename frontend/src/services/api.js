import axios from 'axios';

export const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) || 'https://shadowdine-1.onrender.com/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;