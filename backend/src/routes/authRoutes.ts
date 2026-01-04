import express from 'express';
import { registerUser, loginUser, verifyPassword, changePassword } from '../controller/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-password', protect, verifyPassword);
router.post('/change-password', protect, changePassword);

export default router;
