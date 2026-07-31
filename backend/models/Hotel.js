import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  rating: { type: String, default: '4.5 ⭐' },
  cuisine: { type: String, default: 'Multi-Cuisine' },
  image: { type: String },
  menu: [
    {
      itemName: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, default: 'Main Course' }, // Starter, Main, Dessert
      isVeg: { type: Boolean, default: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Hotel', hotelSchema);