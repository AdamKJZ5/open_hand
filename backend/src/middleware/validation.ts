import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Auth validation rules
 */
export const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  handleValidationErrors
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('New password must contain at least one special character'),
  handleValidationErrors
];

/**
 * Message validation rules
 */
export const sendMessageValidation = [
  body('recipientId')
    .notEmpty()
    .withMessage('Recipient ID is required')
    .isMongoId()
    .withMessage('Invalid recipient ID'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject must not exceed 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 2000 })
    .withMessage('Message content must not exceed 2000 characters'),
  handleValidationErrors
];

/**
 * Schedule validation rules
 */
export const createCaretakerScheduleValidation = [
  body('caretakerId')
    .notEmpty()
    .withMessage('Caretaker ID is required')
    .isMongoId()
    .withMessage('Invalid caretaker ID'),
  body('shifts')
    .isArray({ min: 1 })
    .withMessage('At least one shift is required'),
  body('shifts.*.dayOfWeek')
    .isInt({ min: 0, max: 6 })
    .withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)'),
  body('shifts.*.startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('shifts.*.endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  body('effectiveFrom')
    .isISO8601()
    .withMessage('Effective from date must be a valid ISO 8601 date'),
  handleValidationErrors
];

export const createResidentScheduleValidation = [
  body('residentId')
    .notEmpty()
    .withMessage('Resident ID is required')
    .isMongoId()
    .withMessage('Invalid resident ID'),
  body('scheduleItems')
    .isArray({ min: 1 })
    .withMessage('At least one schedule item is required'),
  body('scheduleItems.*.title')
    .trim()
    .notEmpty()
    .withMessage('Schedule item title is required')
    .isLength({ max: 100 })
    .withMessage('Title must not exceed 100 characters'),
  body('scheduleItems.*.activityType')
    .isIn(['meal', 'activity', 'medication', 'therapy', 'personal_care', 'other'])
    .withMessage('Invalid activity type'),
  body('scheduleItems.*.startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('scheduleItems.*.endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  handleValidationErrors
];

/**
 * User management validation rules
 */
export const updateUserRoleValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('role')
    .isIn(['admin', 'caretaker', 'family', 'default'])
    .withMessage('Invalid role'),
  handleValidationErrors
];

export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

/**
 * Lead validation rules
 */
export const createLeadValidation = [
  body('clientName')
    .trim()
    .notEmpty()
    .withMessage('Client name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('contactEmail')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phoneNumber')
    .trim()
    .matches(/^[\d\s()+-]+$/)
    .withMessage('Invalid phone number format')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('serviceNeeded')
    .trim()
    .notEmpty()
    .withMessage('Service needed is required'),
  body('message')
    .trim()
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),
  handleValidationErrors
];

/**
 * Job posting validation rules
 */
export const createJobPostingValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('salary')
    .trim()
    .notEmpty()
    .withMessage('Salary is required'),
  body('type')
    .isIn(['full-time', 'part-time', 'contract'])
    .withMessage('Invalid job type'),
  handleValidationErrors
];

/**
 * Password reset validation rules
 */
export const requestPasswordResetValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  handleValidationErrors
];

export const resetPasswordValidation = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('New password must contain at least one special character'),
  handleValidationErrors
];
