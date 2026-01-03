import express from 'express';
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
  getMyApplications,
  getApplicationStats
} from '../controller/residentApplicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Public route - submit application (or protected if you want only logged-in users)
router.post('/', submitApplication);

// Protected routes - for logged-in users
router.get('/my-applications', protect, getMyApplications);

// Admin-only routes
router.get('/stats', protect, admin, getApplicationStats);
router.get('/', protect, admin, getAllApplications);
router.get('/:id', protect, getApplicationById); // Owner or Admin
router.put('/:id/status', protect, admin, updateApplicationStatus);
router.put('/:id', protect, updateApplication); // Owner or Admin
router.delete('/:id', protect, admin, deleteApplication);

export default router;
