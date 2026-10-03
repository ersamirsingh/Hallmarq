import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { signAuthToken } from '../utils/token.js';

const DUMMY_HASH = bcrypt.hashSync('dummy_password_timing_defense', env.BCRYPT_COST);

export interface RegisterInput {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existing) {
    throw new HttpError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_COST);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      passwordHash,
      role: Role.USER,
      emailVerified: false
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      emailVerified: true,
      tokenVersion: true
    }
  });

  const token = signAuthToken({
    userId: user.id,
    tokenVersion: user.tokenVersion
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    },
    token
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    await bcrypt.compare(data.password, DUMMY_HASH);
    throw new HttpError(401, 'Email or password is incorrect.');
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new HttpError(403, 'Account is temporarily locked due to too many failed attempts. Please try again later.');
  }

  const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);

  if (!passwordMatch) {
    const updatedCount = user.failedLoginCount + 1;
    const lockedUntil = updatedCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: updatedCount,
        lockedUntil
      }
    });

    throw new HttpError(401, 'Email or password is incorrect.');
  }

  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null
      }
    });
  }

  const token = signAuthToken({
    userId: user.id,
    tokenVersion: user.tokenVersion
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified
    },
    token
  };
};
