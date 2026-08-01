import API from './api';

export const fetchRestaurants = (city, search) => API.get(`/restaurants?city=${city || ''}&search=${search || ''}`);
export const addDishAPI = (restaurantId, dishData) => API.post(`/restaurants/${restaurantId}/dishes`, dishData);
export const bookTableAPI = (bookingData) => API.post('/reservations', bookingData);