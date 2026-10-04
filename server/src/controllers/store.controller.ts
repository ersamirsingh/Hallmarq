import { Request, Response, NextFunction } from 'express';
import { getUserStores, rateStore, removeRating, getStoreReviews } from '../services/store.service.js';

export const getStores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getUserStores(req.user!.id, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const putRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const storeId = Number(req.params.id);
    const result = await rateStore(
      req.user!.id,
      req.user!.emailVerified,
      storeId,
      req.body.value,
      req.body.comment
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const storeId = Number(req.params.id);
    const result = await removeRating(req.user!.id, storeId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const storeId = Number(req.params.id);
    const result = await getStoreReviews(storeId, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
