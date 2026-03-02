
import express from 'express';
import { createLead } from '../controller/leadController';
import { createLeadValidation } from '../middleware/validation';

const router = express.Router();

router.post('/contact', createLeadValidation, createLead);

export default router;
