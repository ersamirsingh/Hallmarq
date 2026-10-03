import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { auth } from '../middleware/auth.js';
import { registerLimiter, loginLimiter } from '../middleware/rateLimiters.js';

export const authRouter = Router();

authRouter.post('/register', registerLimiter, validate(registerSchema), register);
authRouter.post('/login', loginLimiter, validate(loginSchema), login);
authRouter.post('/logout', auth, logout);
authRouter.get('/me', auth, getMe);
