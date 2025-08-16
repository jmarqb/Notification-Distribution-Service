import { applyDecorators, UseGuards } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards';
import { UserRoleEnum } from '../constants/user-role.enum';

jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn(),
  UseGuards: jest.fn(),
}));

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn(() => 'MockAuthGuard'),
}));

jest.mock('../guards/user-role.guard', () => ({
  UserRoleGuard: jest.fn(() => 'UserRoleGuard'),
}));

jest.mock('./role-protected.decorator', () => ({
  RoleProtected: jest.fn(() => 'RoleProtected'),
}));

describe('Auth Decorator', () => {
  it('should call applyDecorators with RoleProtected and UseGuards', () => {
    const roles: UserRoleEnum[] = [UserRoleEnum.ADMIN, UserRoleEnum.USER];

    Auth(...roles);

    expect(applyDecorators).toHaveBeenCalledWith(
      RoleProtected(...roles),
      UseGuards(AuthGuard(), UserRoleGuard),
    );
  });
});
