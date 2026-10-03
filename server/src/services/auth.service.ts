import bcrypt from 'bcrypt';
import { Role, TokenType } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { signAuthToken, generateSecureToken, hashToken } from '../utils/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './mail.service.js';

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

  const { rawToken, tokenHash } = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.authToken.create({
    data: {
      userId: user.id,
      type: TokenType.EMAIL_VERIFY,
      tokenHash,
      expiresAt
    }
  });

  await sendVerificationEmail(user.email, user.name, rawToken);

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

export const verifyEmail = async (token: string): Promise<void> => {
  const tokenHash = hashToken(token);

  const authToken = await prisma.authToken.findUnique({
    where: { tokenHash }
  });

  if (
    !authToken ||
    authToken.type !== TokenType.EMAIL_VERIFY ||
    authToken.usedAt ||
    authToken.expiresAt < new Date()
  ) {
    throw new HttpError(400, 'Invalid or expired verification token');
  }

  await prisma.$transaction([
    prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: authToken.userId },
      data: { emailVerified: true }
    })
  ]);
};

export const resendVerification = async (userId: number): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  if (user.emailVerified) {
    throw new HttpError(400, 'Email is already verified');
  }

  const { rawToken, tokenHash } = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.authToken.create({
    data: {
      userId: user.id,
      type: TokenType.EMAIL_VERIFY,
      tokenHash,
      expiresAt
    }
  });

  await sendVerificationEmail(user.email, user.name, rawToken);
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return;
  }

  const { rawToken, tokenHash } = generateSecureToken();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.authToken.create({
    data: {
      userId: user.id,
      type: TokenType.PASSWORD_RESET,
      tokenHash,
      expiresAt
    }
  });

  await sendPasswordResetEmail(user.email, user.name, rawToken);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const tokenHash = hashToken(token);

  const authToken = await prisma.authToken.findUnique({
    where: { tokenHash }
  });

  if (
    !authToken ||
    authToken.type !== TokenType.PASSWORD_RESET ||
    authToken.usedAt ||
    authToken.expiresAt < new Date()
  ) {
    throw new HttpError(400, 'Invalid or expired password reset token');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, env.BCRYPT_COST);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: authToken.userId },
      data: {
        passwordHash: newPasswordHash,
        tokenVersion: { increment: 1 },
        failedLoginCount: 0,
        lockedUntil: null
      }
    }),
    prisma.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() }
    }),
    prisma.authToken.deleteMany({
      where: {
        userId: authToken.userId,
        type: TokenType.PASSWORD_RESET,
        id: { not: authToken.id }
      }
    })
  ]);
};
