import express from 'express';
import axios from 'axios';
import Hotel from '../models/Hotel.js';

const router = express.Router();

const defaultMenu = [
  { itemName: "Paneer Butter Masala", price: 220, category: "Main Course", isVeg: true },
  { itemName: "Veg Fried Rice", price: 180, category: "Main Course", isVeg: true },
  { itemName: "Special Chicken Biryani", price: 280, category: "Main Course", isVeg: false },
  { itemName: "Garlic Butter Naan", price: 60, category: "Bread", isVeg: true },
  { itemName: "Mutton Chukka", price: 320, category: "Starter", isVeg: false },
  { itemName: "Sizzling Chocolate Brownie", price: 160, category: "Dessert", isVeg: true }
];

// 1. Fetch All Hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({ success: true, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Fetch Single Hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(200).json({
        success: true,
        hotel: {
          _id: req.params.id,
          name: 'ShadowDine Special Dining',
          address: 'Near Your Location',
          rating: '4.5 ⭐',
          cuisine: 'Multi-Cuisine',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
          menu: defaultMenu
        }
      });
    }
    res.status(200).json({ success: true, hotel });
  } catch (error) {
    res.status(200).json({
      success: true,
      hotel: {
        _id: req.params.id,
        name: 'ShadowDine Special Dining',
        address: 'Near Your Location',
        rating: '4.5 ⭐',
        cuisine: 'Multi-Cuisine',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
        menu: defaultMenu
      }
    });
  }
});

// 3. ADMIN: Add New Dish to Restaurant Menu
router.post('/:id/menu', async (req, res) => {
  try {
    const { itemName, price, category, isVeg } = req.body;

    if (!itemName || !price) {
      return res.status(400).json({ success: false, message: 'Dish name and price are required' });
    }

    let hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    hotel.menu.push({
      itemName,
      price: Number(price),
      category: category || 'Main Course',
      isVeg: Boolean(isVeg)
    });

    await hotel.save();

    res.status(200).json({
      success: true,
      message: '🎉 New Dish added to menu successfully!',
      menu: hotel.menu
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;