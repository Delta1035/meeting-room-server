import { Permission } from '../entities/permission.entity';

export interface TokenPayload {
  userId: number;
  username?: string;
  roles?: string[];
  permissions?: Permission[];
}
