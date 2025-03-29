import { randomBytes } from 'crypto';

export const jwtConstants = {
  secret: process.env.JWT_SECRET || randomBytes(32).toString('hex'),
  expiresIn: process.env.JWT_EXPIRATION || '60m',
};