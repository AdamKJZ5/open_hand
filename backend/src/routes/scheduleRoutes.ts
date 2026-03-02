import express from 'express';
import {
  getCaretakerSchedule,
  getCurrentShift,
  createCaretakerSchedule,
  updateCaretakerSchedule,
  deleteCaretakerSchedule,
  exportCaretakerSchedule,
  getResidentSchedule,
  getTodaySchedule,
  createResidentSchedule,
  updateResidentSchedule,
  deleteResidentSchedule,
  exportResidentSchedule
} from '../controller/scheduleController';
import { protect, admin } from '../middleware/authMiddleware';
import {
  createCaretakerScheduleValidation,
  createResidentScheduleValidation,
  mongoIdValidation
} from '../middleware/validation';

const router = express.Router();

// ============= CARETAKER SCHEDULE ROUTES =============
router.get('/caretaker/:userId', protect, mongoIdValidation, getCaretakerSchedule);
router.get('/caretaker/:userId/current-shift', protect, mongoIdValidation, getCurrentShift);
router.get('/caretaker/:userId/export', protect, mongoIdValidation, exportCaretakerSchedule);
router.post('/caretaker', protect, admin, createCaretakerScheduleValidation, createCaretakerSchedule);
router.put('/caretaker/:scheduleId', protect, admin, mongoIdValidation, updateCaretakerSchedule);
router.delete('/caretaker/:scheduleId', protect, admin, mongoIdValidation, deleteCaretakerSchedule);

// ============= RESIDENT SCHEDULE ROUTES =============
router.get('/resident/:userId', protect, mongoIdValidation, getResidentSchedule);
router.get('/resident/:userId/today', protect, mongoIdValidation, getTodaySchedule);
router.get('/resident/:userId/export', protect, mongoIdValidation, exportResidentSchedule);
router.post('/resident', protect, admin, createResidentScheduleValidation, createResidentSchedule);
router.put('/resident/:scheduleId', protect, admin, mongoIdValidation, updateResidentSchedule);
router.delete('/resident/:scheduleId', protect, admin, mongoIdValidation, deleteResidentSchedule);

export default router;
