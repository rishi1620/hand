import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { successResponse } from '../../../server.js';

const router = Router();

// Protected profile route
router.get('/me', requireAuth, (req: Request, res: Response) => {
  // @ts-ignore implementation - user is injected by requireAuth
  const user = req.user;
  
  return successResponse(res, {
    id: user.id,
    email: user.email,
    role: user.role
  });
});

export default router;
