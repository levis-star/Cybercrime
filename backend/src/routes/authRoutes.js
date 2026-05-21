import { Router } from 'express';
import { login, loginSchema, register, registerSchema, verify } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), login);
router.get('/verify', authenticate, verify);

export default router;
