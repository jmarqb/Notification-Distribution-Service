import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards';
import { UserRoleEnum } from '../constants/user-role.enum';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: UserRoleEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
