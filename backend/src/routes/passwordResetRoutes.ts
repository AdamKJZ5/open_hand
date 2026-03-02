import express from 'express';
import { requestPasswordReset, resetPassword } from '../controller/passwordResetController';
import { passwordResetLimiter } from '../config/security';
import { requestPasswordResetValidation, resetPasswordValidation } from '../middleware/validation';

const router = express.Router();

// Request password reset (generates token and sends email/SMS)
router.post('/request', passwordResetLimiter, requestPasswordResetValidation, requestPasswordReset);

// Reset password with token
router.post('/reset', passwordResetLimiter, resetPasswordValidation, resetPassword);

export default router;
