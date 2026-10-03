import bcrypt from 'bcrypt';
import { TokenType } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';
import { env } from '../config/env.js';
import { generateSecureToken, signAuthToken } from '../utils/token.js';
import { sendVerificationEmail } from './mail.service.js';

export const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      emailVerified: true
    }
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return user;
};

export const updateProfile = async (
  userId: number,
  data: { name: string; email: string; address: string }
) => {
  const currentUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!currentUser) {
    throw new HttpError(404, 'User not found');
  }

  if (data.email !== currentUser.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email }
    });
    if (existing && existing.id !== userId) {
      throw new HttpError(409, 'An account with this email already exists');
    }
  }

  const emailChanged = data.email !== currentUser.email;
  const shouldUnverify = env.REQUIRE_EMAIL_VERIFICATION && emailChanged;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      ...(shouldUnverify ? { emailVerified: false } : {})
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      emailVerified: true
    }
  });

  if (shouldUnverify) {
    const { rawToken, tokenHash } = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.authToken.create({
      data: {
        userId,
        type: TokenType.EMAIL_VERIFY,
        tokenHash,
        expiresAt
      }
    });

    await sendVerificationEmail(updatedUser.email, updatedUser.name, rawToken);
  }

  return updatedUser;
};

export const changeUserPassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    throw new HttpError(400, 'Current password is incorrect');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, env.BCRYPT_COST);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: newPasswordHash,
      tokenVersion: { increment: 1 }
    }
  });

  const freshToken = signAuthToken({
    userId: updatedUser.id,
    tokenVersion: updatedUser.tokenVersion
  });

  return { freshToken };
};
