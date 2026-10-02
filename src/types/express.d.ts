import { AuthUser } from '../auth/interfaces/auth-user.interface.js';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
