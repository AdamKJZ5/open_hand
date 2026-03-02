import express from 'express';
import { registerUser, loginUser, verifyPassword, changePassword } from '../controller/authController';
import { protect } from '../middleware/authMiddleware';
import { authLimiter, registrationLimiter } from '../config/security';
import { registerValidation, loginValidation, changePasswordValidation } from '../middleware/validation';

const router = express.Router();

// Apply rate limiting and validation to auth endpoints
router.post('/register', registrationLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.post('/verify-password', protect, verifyPassword);
router.post('/change-password', protect, changePasswordValidation, changePassword);

export default router;
