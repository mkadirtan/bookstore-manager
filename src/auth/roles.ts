import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 'user',
  Manager = 'manager',
  Owner = 'owner',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
