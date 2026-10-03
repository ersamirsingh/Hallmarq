import { Router } from 'express';
import { Role } from '@prisma/client';
import { getDashboard } from '../controllers/owner.controller.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

export const ownerRouter = Router();

ownerRouter.use(auth, requireRole(Role.OWNER));

ownerRouter.get('/dashboard', getDashboard);
