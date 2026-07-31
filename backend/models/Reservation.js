import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  restaurantName: { type: String, required: true },
  guestsCount: { type: Number, required: true },
  reservationDate: { type: String, required: true },
  timeSlot: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);