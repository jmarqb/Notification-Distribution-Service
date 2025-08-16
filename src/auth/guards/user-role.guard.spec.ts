import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './user-role.guard';
import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

describe('UserRole Guard', () => {
  let guard: UserRoleGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new UserRoleGuard(reflector);

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should return true if no roles are present', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return true if no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue([]);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw BadRequestException if user is not found', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({});

    expect(() => guard.canActivate(mockContext)).toThrow(BadRequestException);
    expect(() => guard.canActivate(mockContext)).toThrow('User not found');
  });

  it('should return true if user has a valid role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['ADMIN']);
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({
      user: {
        roles: ['ADMIN'],
        firstName: 'John',
      },
    });

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw ForbiddenException if user lacks required role', () => {
    const user = {
      roles: ['USER'],
      firstName: 'John ',
    };

    const validRoles = ['ADMIN'];

    jest.spyOn(reflector, 'get').mockReturnValue(validRoles);
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({
      user: user,
    });

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow(
      `User ${user.firstName} need a valid role: [${validRoles.join(',')}]`,
    );
  });
});
