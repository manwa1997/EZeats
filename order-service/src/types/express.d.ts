import { User } from '../../../shared/entities/user.entity';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: User; 
    }
  }
}