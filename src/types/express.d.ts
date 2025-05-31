import { User } from '../database/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      flash(type: string, message?: any): any;
      user?: Omit<User, 'password_hash'>;
      query: {
        [key: string]: string | undefined;
      };
    }
  }
} 