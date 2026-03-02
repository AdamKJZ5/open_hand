import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

/**
 * Generic role-based access control middleware factory
 * Usage: protect, authorize('admin', 'caretaker')
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no user found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Admin-only middleware (backward compatible with existing code)
 */
export const admin = authorize('admin');

/**
 * Caretaker or Admin middleware
 */
export const caretakerOrAdmin = authorize('caretaker', 'admin');

/**
 * Family or Admin middleware
 */
export const familyOrAdmin = authorize('family', 'admin');

/**
 * Caretaker-only middleware
 */
export const caretakerOnly = authorize('caretaker');

/**
 * Family-only middleware
 */
export const familyOnly = authorize('family');

/**
 * Middleware to check if user owns the resource or is admin
 * Expects userId in req.params
 */
export const ownerOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - no user found'
    });
  }

  const { userId } = req.params;
  const isOwner = req.user.id === userId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  }

  next();
};
