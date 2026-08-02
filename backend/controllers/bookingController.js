import Booking from '../models/Booking.js';

// 1. Create New Booking
export const createBooking = async (req, res) => {
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

    const userId = req.user?.id || req.user?._id;
    const finalCustomerName = customerName || req.user?.name || 'Guest User';
    const finalCustomerPhone = customerPhone || req.user?.phone || '0000000000';

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }

    const newBooking = new Booking({
      user: userId || null,
      hotelId,
      hotelName: hotelName || 'ShadowDine Dining',
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      tablesCount: Number(tablesCount) || 1,
      guests: Number(guests) || 1,
      eventType: eventType || 'Casual Dining',
      seatingPreference: seatingPreference || 'AC Hall',
      date: date || new Date().toISOString().split('T')[0],
      time: time || '07:00 PM (Dinner)',
      specialRequest: specialRequest || '',
      orderedItems: orderedItems || [],
      totalAmount: Number(totalAmount) || 0,
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

// 2. Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const query = userId ? { user: userId } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });

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