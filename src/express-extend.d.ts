import type { UserPayload } from './user/user.entity';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}
