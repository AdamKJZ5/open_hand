import express from 'express';
import { 
  getOpportunities, 
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  joinOpportunity
 } from '../controller/appController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();


//Public Route
router.get('/', getOpportunities);
router.post('/:id/join', protect, joinOpportunity );

//Admin
router.post('/', protect, admin, createOpportunity);
router.put('/:id', protect, admin, updateOpportunity);
router.delete('/:id', protect, admin, deleteOpportunity);


export default router;
