import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      create: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should create user with the proper DTO', async () => {
    const dto: CreateUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
      firstName: 'Test User',
      lastName: 'lastName',
    };

    await authController.createUser(dto);
    expect(authService.create).toHaveBeenCalled();
    expect(authService.create).toHaveBeenCalledWith(dto);
  });

  it('should login user with the proper DTO', async () => {
    const dto: LoginUserDto = {
      email: 'test@google.com',
      password: 'Abc123',
    };

    await authController.loginUser(dto);
    expect(authService.login).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
