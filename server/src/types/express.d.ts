import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  address: string;
  role: Role;
  emailVerified: boolean;
  tokenVersion: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
