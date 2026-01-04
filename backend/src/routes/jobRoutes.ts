import express from 'express';
import {
  getActiveJobPostings,
  getAllJobPostings,
  getJobPostingById,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting
} from '../controller/jobPostingController';
import {
  submitJobApplication,
  getMyJobApplications,
  getAllJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication
} from '../controller/jobApplicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Job Posting Routes
router.get('/postings/active', getActiveJobPostings); // Public - get active jobs
router.get('/postings', protect, admin, getAllJobPostings); // Admin - get all jobs
router.get('/postings/:id', getJobPostingById); // Public - get single job
router.post('/postings', protect, admin, createJobPosting); // Admin - create job
router.put('/postings/:id', protect, admin, updateJobPosting); // Admin - update job
router.delete('/postings/:id', protect, admin, deleteJobPosting); // Admin - delete job

// Job Application Routes
router.post('/postings/:jobId/apply', protect, submitJobApplication); // User - apply to job
router.get('/applications/my-applications', protect, getMyJobApplications); // User - get own applications
router.get('/applications', protect, admin, getAllJobApplications); // Admin - get all applications
router.put('/applications/:id/status', protect, admin, updateJobApplicationStatus); // Admin - update status
router.delete('/applications/:id', protect, admin, deleteJobApplication); // Admin - delete application

export default router;
