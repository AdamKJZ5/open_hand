import express from 'express';
import { requestPasswordReset, resetPassword } from '../controller/passwordResetController';

const router = express.Router();

// Request password reset (generates token and sends email/SMS)
router.post('/request', requestPasswordReset);

// Reset password with token
router.post('/reset', resetPassword);

export default router;
