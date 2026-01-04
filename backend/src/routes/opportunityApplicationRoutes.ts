import express from 'express';
import {
  applyToOpportunity,
  getMyApplications,
  getAllApplications,
  getOpportunityApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} from '../controller/opportunityApplicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// User routes
router.get('/my-applications', protect, getMyApplications);

// Admin routes
router.get('/stats', protect, admin, getApplicationStats);
router.get('/', protect, admin, getAllApplications);
router.put('/:id/status', protect, admin, updateApplicationStatus);
router.delete('/:id', protect, admin, deleteApplication);

export default router;

// Note: The apply route is in the opportunities routes as POST /api/opportunities/:id/apply
// and GET /api/opportunities/:id/applications for viewing applications for a specific opportunity
