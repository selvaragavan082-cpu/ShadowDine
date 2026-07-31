import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hotelId: { type: String, required: true },
  hotelName: { type: String },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  tablesCount: { type: Number, default: 1 },
  guests: { type: Number, default: 2 },
  eventType: { type: String, default: 'Casual Dining' },
  seatingPreference: { type: String, default: 'AC Hall' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  specialRequest: { type: String },
  orderedItems: [
    {
      itemName: String,
      price: Number,
      quantity: Number,
      isVeg: Boolean
    }
  ],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);