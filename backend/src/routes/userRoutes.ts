import express from 'express';
import { getAllUsers, updateUserRole, toggleUserSchedule, deleteUser } from '../controller/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication and admin role
router.get('/', protect, admin, getAllUsers);
router.put('/:userId/role', protect, admin, updateUserRole);
router.put('/:userId/schedule', protect, admin, toggleUserSchedule);
router.delete('/:userId', protect, admin, deleteUser);

export default router;
