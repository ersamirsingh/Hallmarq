import { Router } from 'express';
import {
  handleGetProfile,
  handleUpdateProfile,
  handleChangePassword
} from '../controllers/profile.controller.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { userWritesLimiter } from '../middleware/rateLimiters.js';
import { updateProfileSchema, changePasswordSchema } from '../schemas/auth.schema.js';

export const profileRouter = Router();

profileRouter.use(auth);

profileRouter.get('/', handleGetProfile);
profileRouter.put('/', userWritesLimiter, validate(updateProfileSchema), handleUpdateProfile);
profileRouter.patch('/', userWritesLimiter, validate(updateProfileSchema), handleUpdateProfile);

profileRouter.put('/password', userWritesLimiter, validate(changePasswordSchema), handleChangePassword);
profileRouter.post('/password', userWritesLimiter, validate(changePasswordSchema), handleChangePassword);
profileRouter.post('/change-password', userWritesLimiter, validate(changePasswordSchema), handleChangePassword);
profileRouter.put('/change-password', userWritesLimiter, validate(changePasswordSchema), handleChangePassword);
