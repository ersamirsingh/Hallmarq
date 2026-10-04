import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'node:crypto';
import { Response, CookieOptions } from 'express';
import { env } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'token';

export interface JwtAuthPayload {
  userId: number;
  tokenVersion: number;
}

export const signAuthToken = (payload: JwtAuthPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '7d',
    issuer: 'hallmarq',
    audience: 'hallmarq-client'
  });
};

export const verifyAuthToken = (tokenString: string): JwtAuthPayload => {
  return jwt.verify(tokenString, env.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'hallmarq',
    audience: 'hallmarq-client'
  }) as JwtAuthPayload;
};

export const getAuthCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
});

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...getAuthCookieOptions(),
    maxAge: 0
  });
};

export const hashToken = (rawToken: string): string => {
  return createHash('sha256').update(rawToken).digest('hex');
};

export const generateSecureToken = (): { rawToken: string; tokenHash: string } => {
  const rawToken = randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
};
