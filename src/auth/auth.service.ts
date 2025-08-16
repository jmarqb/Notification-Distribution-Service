import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { UserRoleEnum } from './constants/user-role.enum';
import { generateUUID } from '../common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(User.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto._id = generateUUID();
      const { password, ...userData } = createUserDto;

      const user = await this.userModel.create({
        ...userData,
        roles: [UserRoleEnum.USER],
        password: bcrypt.hashSync(password, 10),
      });

      const userObj = user.toObject();
      const { password: _, ...createdUserData } = user.toObject();

      return {
        user: createdUserData,
        token: this.getJwtToken({
          id: userObj._id.toString(),
          email: userObj.email,
          roles: userObj.roles,
        }),
      };
    } catch (error) {
      this.logger.error(error);
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userModel
      .findOne(
        {
          email,
          deleted: false,
        },
        'email password _id firstName lastName deleted roles',
      )
      .exec();

    if (!user)
      throw new UnauthorizedException({
        message: 'Credentials or email are not valid',
        reference: 'UNAUTHORIZED',
      });

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException({
        message: 'Credentials or email are not valid',
        reference: 'UNAUTHORIZED',
      });

    return {
      token: this.getJwtToken({
        id: user.id,
        email: user.email,
        roles: user.roles,
      }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException({
        message: 'User already exists',
        reference: 'BAD_REQUEST',
      });
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
