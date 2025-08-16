import { META_ROLES, RoleProtected } from './role-protected.decorator';
import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../constants/user-role.enum';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('RoleProtected Decorator ', () => {
  it('should set metadata with the correct roles', () => {
    const roles = [UserRoleEnum.ADMIN, UserRoleEnum.USER];

    const result = RoleProtected(...roles);

    expect(SetMetadata).toHaveBeenCalled();
    expect(SetMetadata).toHaveBeenCalledWith(META_ROLES, roles);
  });
});
