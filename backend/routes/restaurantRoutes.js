import express from 'express';
import { getRestaurants, createRestaurant, addDish } from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getRestaurants);
router.post('/', protect, adminOnly, createRestaurant);
router.post('/:restaurantId/dishes', protect, adminOnly, addDish);

export default router;