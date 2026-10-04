import { Request, Response, NextFunction } from 'express';
import { getProfile, updateProfile, changeUserPassword } from '../services/profile.service.js';
import { setAuthCookie } from '../utils/token.js';

export const handleGetProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await getProfile(req.user!.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const handleUpdateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await updateProfile(req.user!.id, req.body);
    res.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const handleChangePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { freshToken } = await changeUserPassword(
      req.user!.id,
      req.body.currentPassword,
      req.body.newPassword
    );
    setAuthCookie(res, freshToken);
    res.json({ message: 'Password changed successfully', token: freshToken });
  } catch (err) {
    next(err);
  }
};
