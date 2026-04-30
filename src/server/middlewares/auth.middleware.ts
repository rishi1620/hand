import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../../../server.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Unauthorized - Missing token', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Forward user data to request
    // @ts-ignore
    req.user = decoded;
    
    next();
  } catch (error) {
    return errorResponse(res, 'Unauthorized - Invalid or expired token', 401);
  }
};
