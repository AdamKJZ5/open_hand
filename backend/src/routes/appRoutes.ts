import express from 'express';
import { getOpportunities, createOpportunity } from '../controller/oppController';

const router = express.Router();

router.get('/', getOpportunities);
router.post('/', createOpportunity);

export default router;
