import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { hashSync } from 'bcrypt';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  const userId = 'f9867a22-fd95-4737-85ad-0215e2332872';

  const mockUserModel = {
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    create: jest.fn(),
  };
  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        AuthService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should create a user and return user with token', async () => {
    const dto: CreateUserDto = {
      firstName: 'Test User',
      lastName: 'Test User',
      email: 'test@google.com',
      password: 'Abc123',
    };

    const user = {
      toObject: () => ({
        _id: userId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        deleted: false,
        roles: ['USER'],
        password: 'Ajhsjdhjdhjs',
      }),
    };

    jest.spyOn(userModel, 'create').mockResolvedValue(user as any);
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue('Ajhsjdhjdhjs');

    const result = await authService.create(dto);

    expect(bcrypt.hashSync).toHaveBeenCalledWith(dto.password, 10);
    expect(result).toEqual({
      user: {
        _id: userId,
        email: 'test@google.com',
        firstName: 'Test User',
        lastName: 'Test User',
        deleted: false,
        roles: ['USER'],
      },
      token: 'mock-jwt-token',
    });
  });

  it('should throw an error if email already exist', async () => {
    const dto: CreateUserDto = {
      firstName: 'Test User',
      lastName: 'Test User',
      email: 'test@google.com',
      password: 'Abc123',
    };

    jest.spyOn(userModel, 'create').mockRejectedValue({
      code: 11000,
      detail: 'User already exists',
    });
    await expect(authService.create(dto)).rejects.toThrow(BadRequestException);
    await expect(authService.create(dto)).rejects.toThrow(
      expect.objectContaining({
        message: 'User already exists',
      }),
    );
  });

  it('should throw an internal server error', async () => {
    const dto: CreateUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
      firstName: 'Test User',
      lastName: 'Test User',
    };

    jest.spyOn(userModel, 'create').mockRejectedValue({
      code: '500',
      detail: 'any error',
    });
    await expect(authService.create(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(authService.create(dto)).rejects.toThrow('Unexpected error');
  });

  it('should login user an return token', async () => {
    const dto: LoginUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
    };

    const user = {
      id: userId,
      email: dto.email,
      password: 'hashedPassword',
      roles: ['USER'],
      deleted: false,
    } as unknown as User;

    jest.spyOn(userModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    } as any);

    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

    const result = await authService.login(dto);

    expect(result).toEqual({ token: 'mock-jwt-token' });
  });

  it('should throw an UnauthorizedException if user does not exists', async () => {
    const dto: LoginUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
    };

    jest.spyOn(userModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    await expect(authService.login(dto)).rejects.toThrow(
      expect.objectContaining({
        message: 'Credentials or email are not valid',
      }),
    );
  });
  it('should throw an UnauthorizedException if bcrypt compareSync fails', async () => {
    const dto: LoginUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
    };

    const user = {
      ...dto,
      password: 'Abc123',
      isActive: true,
    } as unknown as User;

    jest.spyOn(userModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    } as any);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    await expect(authService.login(dto)).rejects.toThrow(
      expect.objectContaining({
        message: 'Credentials or email are not valid',
      }),
    );
  });
});
