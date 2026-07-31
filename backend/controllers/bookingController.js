import Booking from '../models/Booking.js';

// 1. Create New Booking
export const createBooking = async (req, res) => {
  try {
    const { 
      hotelId, 
      customerName, 
      name, 
      tablesCount, 
      guests, 
      eventType, 
      date, 
      time, 
      seatingArea, 
      specialRequest 
    } = req.body;

    const userId = req.user?.id || req.user?._id;
    const finalCustomerName = customerName || name || req.user?.name || 'Guest User';

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }

    const newBooking = new Booking({
      user: userId,
      hotel: hotelId,
      customerName: finalCustomerName,
      tablesCount: Number(tablesCount) || 1,
      guests: Number(guests) || 1,
      eventType: eventType || 'Casual Dining',
      date: date || new Date().toISOString().split('T')[0],
      time: time || '07:00 PM (Dinner)',
      seatingArea: seatingArea || 'Indoor AC',
      specialRequest: specialRequest || '',
      status: 'Confirmed'
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: '🎉 Reservation Confirmed Successfully!',
      booking: newBooking
    });

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process booking'
    });
  }
};

// 2. Get User Bookings (Export missing-a irundhadhu, ippo add panniyaachu!)
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};