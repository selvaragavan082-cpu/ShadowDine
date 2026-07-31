import Reservation from '../models/Reservation.js';
import sendReservationEmail from '../utils/sendEmail.js';

export const createReservation = async (req, res) => {
  try {
    const { restaurantName, date, time, guests, userEmail, userName } = req.body;

    // 1. Save to DB
    const newReservation = new Reservation({
      restaurantName,
      date,
      time,
      guests,
      userEmail,
      userName,
      user: req.user ? req.user.id : null
    });

    await newReservation.save();

    // 2. Email Anuppu (Background Process)
    if (userEmail) {
      sendReservationEmail(userEmail, {
        userName,
        restaurantName,
        date,
        time,
        guests
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