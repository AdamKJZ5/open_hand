import express from 'express';
import { getAllUsers, updateUserRole, toggleUserSchedule, deleteUser } from '../controller/userController';
import { protect, admin } from '../middleware/authMiddleware';
import { updateUserRoleValidation, mongoIdValidation } from '../middleware/validation';

const router = express.Router();

// All routes require authentication and admin role
router.get('/', protect, admin, getAllUsers);
router.put('/:userId/role', protect, admin, updateUserRoleValidation, updateUserRole);
router.put('/:userId/schedule', protect, admin, mongoIdValidation, toggleUserSchedule);
router.delete('/:userId', protect, admin, mongoIdValidation, deleteUser);

export default router;
