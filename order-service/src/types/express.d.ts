import { User } from '../../../shared/entities/user.entity'; // Make sure the import path is correct

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
