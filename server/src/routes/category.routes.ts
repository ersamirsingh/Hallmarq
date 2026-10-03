import { Router } from 'express';
import { getCategories } from '../controllers/category.controller.js';
import { auth } from '../middleware/auth.js';

export const categoryRouter = Router();

categoryRouter.use(auth);

categoryRouter.get('/', getCategories);
