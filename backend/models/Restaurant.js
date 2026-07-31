import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  dishName: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'Main Course' }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  dishes: [dishSchema]
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);