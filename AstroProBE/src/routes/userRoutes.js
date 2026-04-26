import express from 'express';
import { getMe } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Protect all routes in this file
router.get('/me', protect, getMe);

export default router;