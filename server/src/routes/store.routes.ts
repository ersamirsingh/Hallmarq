import { Router } from 'express';
import { getStores, putRating, getReviews } from '../controllers/store.controller.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { userWritesLimiter } from '../middleware/rateLimiters.js';
import { submitRatingSchema } from '../schemas/rating.schema.js';

export const storeRouter = Router();

storeRouter.use(auth);

storeRouter.get('/', getStores);
storeRouter.put('/:id/rating', userWritesLimiter, validate(submitRatingSchema), putRating);
storeRouter.get('/:id/reviews', getReviews);
