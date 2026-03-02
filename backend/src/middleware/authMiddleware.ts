import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { logError } from '../config/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

      req.user = decoded; 

      next();
    } catch (error) {
      logError('JWT Verification Error', error as Error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Access granted
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
