import { Request, Response, NextFunction } from 'express';
import {
  getAdminStats,
  getAdminUsers,
  createAdminUser,
  getAdminUserDetails,
  getAdminStores,
  createAdminStore,
  getAvailableOwners,
  getAdminRatings
} from '../services/admin.service.js';

export const getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await getAdminStats();
    res.json({
      stats,
      ...stats
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getAdminUsers(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const postUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await createAdminUser(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const user = await getAdminUserDetails(id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const getStoresList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getAdminStores(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const postStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const store = await createAdminStore(req.body);
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
};

export const getAvailableOwnersList = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const owners = await getAvailableOwners();
    res.json({ owners, data: owners });
  } catch (err) {
    next(err);
  }
};

export const getRatingsList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getAdminRatings(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
