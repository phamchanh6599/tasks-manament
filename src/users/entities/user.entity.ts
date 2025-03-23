import { Role } from '@/common/enums/role.enum';

export class User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  isEmailVerified: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
