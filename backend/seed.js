import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hotel from './models/Hotel.js';

dotenv.config();

const sampleHotels = [
  {
    name: "SR HOTEL",
    city: "Salem",
    address: "Near Junction, Salem, Tamil Nadu",
    location: { lat: 11.7606, lng: 78.0782 }, // Exact GPS match
    rating: "4.5 ⭐",
    cuisine: "South Indian, Tandoori",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    menu: [
      { itemName: "Paneer Butter Masala", price: 220, category: "Main Course", isVeg: true },
      { itemName: "Chicken Biryani", price: 280, category: "Main Course", isVeg: false },
      { itemName: "Garlic Naan", price: 50, category: "Bread", isVeg: true },
      { itemName: "Sizzling Brownie", price: 150, category: "Dessert", isVeg: true }
    ]
  },
  {
    name: "Grand Estancia",
    city: "Salem",
    address: "Bangalore Highway, Salem, Tamil Nadu",
    location: { lat: 11.6850, lng: 78.1380 },
    rating: "4.8 ⭐",
    cuisine: "Multi-Cuisine, Continental",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
    menu: [
      { itemName: "Grilled Salmon", price: 450, category: "Main Course", isVeg: false },
      { itemName: "Mushroom Pasta", price: 310, category: "Main Course", isVeg: true },
      { itemName: "Tiramisu", price: 200, category: "Dessert", isVeg: true }
    ]
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shadowdine')
  .then(async () => {
    await Hotel.deleteMany({});
    await Hotel.insertMany(sampleHotels);
    console.log("✅ Sample Hotels with GPS & Menu Added Successfully!");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error Seeding Data:", err);
    process.exit(1);
  });