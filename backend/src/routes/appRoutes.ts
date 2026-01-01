import express from 'express';
import { getOpportunities, createOpportunity } from '../controller/appController';
import { protect, authorization } from '../middleware/authMiddleware';
const router = express.Router();

router.get('/', getOpportunities);
router.post('/', protect, authorizeRoles('admin', 'caretaker') createOpportunity);

export default router;
