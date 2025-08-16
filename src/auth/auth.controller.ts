import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { BAD_REQUEST_EXAMPLE, UNAUTHORIZED_EXAMPLE } from '../common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register user',
  })
  @ApiResponse({ status: 201, description: 'User was created', type: User })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BAD_REQUEST_EXAMPLE,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Register user',
  })
  @ApiResponse({
    status: 201,
    description: 'User login success',
    example: { token: 'token-string' },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BAD_REQUEST_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UNAUTHORIZED_EXAMPLE,
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
