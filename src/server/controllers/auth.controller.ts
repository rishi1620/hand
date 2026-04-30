import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../../../server.js';
import { loginSchema, registerSchema } from '../validators/auth.schema.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Bind methods using arrow functions for routing compatibility
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = loginSchema.parse(req.body);
      const result = await this.authService.login(parsedBody);
      
      // Simulate sending secure cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      return successResponse(res, {
        accessToken: result.accessToken,
        user: result.user
      });
    } catch (error: any) {
      // Zod validation errors will be caught and standardized here in absolute production,
      // simplifying for brevity
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = registerSchema.parse(req.body);
      const user = await this.authService.register(parsedBody);
      return successResponse(res, user, 201);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      if (!refreshToken) return errorResponse(res, 'No refresh token provided', 400);

      const result = await this.authService.refresh(refreshToken);
      return successResponse(res, { accessToken: result.accessToken });
    } catch (error) {
      next(error);
    }
  };
}
