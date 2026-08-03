import API from './api';
import authService from './authService';
import restaurantService from './restaurantService';
import bookingService from './bookingService';
import geminiService from './geminiService';
import mapService from './mapService';
import aiService from './aiService';

export { API };
export * from './authService';
export * from './restaurantService';
export * from './bookingService';
export * from './geminiService';
export * from './mapService';
export * from './aiService';

const services = {
  API,
  auth: authService,
  restaurant: restaurantService,
  booking: bookingService,
  gemini: geminiService,
  map: mapService,
  ai: aiService,
};

export default services;
