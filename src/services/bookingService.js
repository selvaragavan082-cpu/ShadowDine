import API from './api';

export const getMyBookingsAPI = () => API.get('/bookings/my-bookings');
export const getBookingByIdAPI = (bookingId) => API.get(`/bookings/${bookingId}`);
export const cancelBookingAPI = (bookingId) => API.delete(`/bookings/${bookingId}`);

const bookingService = {
  getMyBookingsAPI,
  getBookingByIdAPI,
  cancelBookingAPI,
};

export default bookingService;
