
import express from 'express';
import { createLead } from '../controller/leadController';

const router = express.Router();

router.post('/contact', createLead);

export default router;
