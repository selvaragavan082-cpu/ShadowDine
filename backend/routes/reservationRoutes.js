import express from 'express';
import { createReservation } from '../controllers/reservationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, createReservation);

export default router;