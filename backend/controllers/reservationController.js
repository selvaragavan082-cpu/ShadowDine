import Reservation from '../models/Reservation.js';
import sendReservationEmail from '../utils/sendEmail.js';

export const createReservation = async (req, res) => {
  try {
    const { restaurantName, date, time, guests, userEmail, userName, customerName, customerEmail, guestsCount, reservationDate, timeSlot } = req.body;

    const finalCustomerName = userName || customerName || req.user?.name || 'Guest User';
    const finalCustomerEmail = userEmail || customerEmail || req.user?.email || 'guest@example.com';
    const finalRestaurantName = restaurantName || 'ShadowDine Restaurant';
    const finalGuestsCount = Number(guests || guestsCount) || 2;
    const finalReservationDate = date || reservationDate || new Date().toISOString().split('T')[0];
    const finalTimeSlot = time || timeSlot || '07:00 PM';

    // 1. Save to DB
    const newReservation = new Reservation({
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      restaurantName: finalRestaurantName,
      guestsCount: finalGuestsCount,
      reservationDate: finalReservationDate,
      timeSlot: finalTimeSlot
    });

    await newReservation.save();

    // 2. Email Notification (Background Process)
    if (finalCustomerEmail) {
      sendReservationEmail(finalCustomerEmail, {
        userName: finalCustomerName,
        restaurantName: finalRestaurantName,
        date: finalReservationDate,
        time: finalTimeSlot,
        guests: finalGuestsCount
      });
    }

    res.status(201).json({
      success: true,
      message: 'Reservation booked successfully & Confirmation email sent!',
      data: newReservation
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};