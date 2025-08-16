import { getUser } from './get-user.decorator';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

jest.mock('@nestjs/common', () => ({
  createParamDecorator: jest.fn().mockImplementation(() => jest.fn()),
  InternalServerErrorException:
    jest.requireActual('@nestjs/common').InternalServerErrorException,
}));

describe('GetUser Decorator', () => {
  const mockUser = {
    id: 'f9867a22-fd95-4737-85ad-0215e2332872',
    email: 'user@email',
    fullName: 'john doe',
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: mockUser,
      }),
    }),
  } as unknown as ExecutionContext;

  it('should return the user from the request', () => {
    const result = getUser('', mockExecutionContext);

    expect(result).toEqual(mockUser);
  });

  it('should return the user specified data[fullName] from the request', () => {
    const result = getUser('fullName', mockExecutionContext);

    expect(result).toEqual(mockUser.fullName);
  });

  it('should call createParamDecorator with getUser', () => {
    expect(createParamDecorator).toHaveBeenCalledWith(getUser);
  });

  it('should throw a InternalServerErrorException if user not exist in req', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: null,
        }),
      }),
    } as unknown as ExecutionContext;

    try {
      getUser('', mockExecutionContext);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('User not found (request)');
    }
  });
});
