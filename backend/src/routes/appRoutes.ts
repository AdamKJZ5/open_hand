import express from 'express';
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  joinOpportunity
 } from '../controller/appController';
import {
  applyToOpportunity,
  getOpportunityApplications
} from '../controller/opportunityApplicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();


//Public Route
router.get('/', getOpportunities);

//Protected Routes
router.post('/:id/join', protect, joinOpportunity);
router.post('/:id/apply', protect, applyToOpportunity);

//Admin
router.post('/', protect, admin, createOpportunity);
router.put('/:id', protect, admin, updateOpportunity);
router.delete('/:id', protect, admin, deleteOpportunity);
router.get('/:id/applications', protect, admin, getOpportunityApplications);


export default router;
