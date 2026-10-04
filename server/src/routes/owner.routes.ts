import { Router } from 'express';
import { Role } from '@prisma/client';
import { getDashboard, patchStoreName } from '../controllers/owner.controller.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import { updateStoreNameSchema } from '../schemas/store.schema.js';

export const ownerRouter = Router();

ownerRouter.use(auth, requireRole(Role.OWNER));

ownerRouter.get('/dashboard', getDashboard);
ownerRouter.patch('/store', validate(updateStoreNameSchema), patchStoreName);
