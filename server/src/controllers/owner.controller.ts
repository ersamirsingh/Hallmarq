import { Request, Response, NextFunction } from 'express';
import { getOwnerDashboard, updateOwnerStoreName } from '../services/owner.service.js';

export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dashboard = await getOwnerDashboard(req.user!.id, req.query);
    res.json(dashboard);
  } catch (err) {
    next(err);
  }
};

export const patchStoreName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await updateOwnerStoreName(req.user!.id, req.body.name);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
