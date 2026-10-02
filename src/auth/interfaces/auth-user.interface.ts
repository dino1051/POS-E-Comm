import { Role } from '../../generated/prisma/enums.js';

export interface AuthUser {
  userId: number;
  email: string;
  role: Role;
}
