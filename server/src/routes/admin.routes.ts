import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getStats,
  getUsersList,
  postUser,
  getUserById,
  getStoresList,
  postStore,
  getAvailableOwnersList
} from '../controllers/admin.controller.js';
import { handleCreateCategory } from '../controllers/category.controller.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validate } from '../middleware/validate.js';
import { adminCreateLimiter } from '../middleware/rateLimiters.js';
import { adminCreateUserSchema } from '../schemas/user.schema.js';
import { createStoreSchema } from '../schemas/store.schema.js';
import { createCategorySchema } from '../schemas/category.schema.js';

export const adminRouter = Router();

adminRouter.use(auth, requireRole(Role.ADMIN));

adminRouter.get('/stats', getStats);
adminRouter.get('/users', getUsersList);
adminRouter.post('/users', adminCreateLimiter, validate(adminCreateUserSchema), postUser);
adminRouter.get('/users/:id', getUserById);
adminRouter.get('/stores', getStoresList);
adminRouter.post('/stores', adminCreateLimiter, validate(createStoreSchema), postStore);
adminRouter.get('/owners/available', getAvailableOwnersList);
adminRouter.post('/categories', adminCreateLimiter, validate(createCategorySchema), handleCreateCategory);
