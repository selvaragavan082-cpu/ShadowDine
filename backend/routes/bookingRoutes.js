import express from 'express';
import Booking from '../models/Booking.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Booking Route
router.post('/', async (req, res) => {
  try {
    const {
      hotelId,
      hotelName,
      customerName,
      customerPhone,
      tablesCount,
      guests,
      eventType,
      seatingPreference,
      date,
      time,
      specialRequest,
      orderedItems,
      totalAmount
    } = req.body;

    if (!customerName || !customerPhone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in required fields (Name, Phone, Date, Time)'
      });
    }

    const newBooking = new Booking({
      hotelId: hotelId || 'real_place_1',
      hotelName: hotelName || 'ShadowDine Special Dining',
      customerName,
      customerPhone,
      tablesCount: Number(tablesCount) || 1,
      guests: Number(guests) || 2,
      eventType: eventType || 'Casual Dining',
      seatingPreference: seatingPreference || 'AC Hall',
      date,
      time,
      specialRequest: specialRequest || '',
      orderedItems: orderedItems || [],
      totalAmount: Number(totalAmount) || 0,
      status: 'Confirmed'
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: '🎉 Reservation & Pre-Order Placed Successfully!',
      booking: newBooking
    });

  } catch (error) {
    console.error('Booking Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Booking Failed: ' + error.message
    });
  }
});

// Fetch User Bookings Route
router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;