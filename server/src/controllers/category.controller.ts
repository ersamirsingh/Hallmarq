import { Request, Response, NextFunction } from 'express';
import { getAllCategories, createCategory } from '../services/category.service.js';

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
};

export const handleCreateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await createCategory(req.body.name);
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
};
