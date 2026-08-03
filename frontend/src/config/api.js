export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL 
  ? (process.env.REACT_APP_BACKEND_URL.endsWith('/api') 
      ? process.env.REACT_APP_BACKEND_URL 
      : `${process.env.REACT_APP_BACKEND_URL}/api`)
  : (process.env.NODE_ENV === 'production' 
      ? 'https://shadowdine-1.onrender.com/api' 
      : 'http://localhost:5000/api');

export default API_BASE_URL;
