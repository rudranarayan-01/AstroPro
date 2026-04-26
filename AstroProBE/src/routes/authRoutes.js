import express from 'express';
import { register, login, forgotPassword, resetPassword, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { audit } from '../middlewares/audit.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', audit('LOGIN_ATTEMPT'), login);
router.post('/forgot-password', forgotPassword);

// Password update requires the user to be authenticated (via recovery token)
router.post('/reset-password', protect, resetPassword);
router.post('/logout', protect, logout);

export default router;