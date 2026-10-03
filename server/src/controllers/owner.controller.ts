import { Request, Response, NextFunction } from 'express';
import { getOwnerDashboard } from '../services/owner.service.js';

export const getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dashboard = await getOwnerDashboard(req.user!.id, req.query);
    res.json(dashboard);
  } catch (err) {
    next(err);
  }
};
