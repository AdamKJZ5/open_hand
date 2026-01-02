import express from 'express';
import { getOpportunities, createOpportunity } from '../controller/appController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getOpportunities);
router.post('/', protect, admin, createOpportunity);

export default router;
