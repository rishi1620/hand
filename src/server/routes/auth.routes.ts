import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = Router();
const authController = new AuthController();

// Auth Endpoints
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);

export default router;
