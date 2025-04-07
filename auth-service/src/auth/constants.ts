import { randomBytes } from 'crypto';

export const jwtConstants = {
  secret: process.env.JWT_SECRET || randomBytes(32).toString('hex'),
  expiresIn: '30m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || randomBytes(32).toString('hex'),
  refreshExpiresIn: '7d', // Refresh tokens last for 7 days
};
