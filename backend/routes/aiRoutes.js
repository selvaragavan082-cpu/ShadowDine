import express from 'express';
import { askGemini } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', askGemini);

export default router;