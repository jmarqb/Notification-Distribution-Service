import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { envs } from '../../config';
import { JwtPayload } from '../interfaces';
import { User } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwt_secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id, email, roles } = payload;
    if (!id || !email || !roles) {
      throw new UnauthorizedException({
        message: 'Token malformed',
        reference: 'UNAUTHORIZED',
      });
    }

    const user = await this.userModel
      .findOne(
        {
          _id: id,
          deleted: false,
        },
        { password: 0 },
      )
      .exec();

    if (!user) {
      throw new UnauthorizedException({
        message: 'Unauthorized, token invalid or user not exists',
        reference: 'UNAUTHORIZED',
      });
    }
    return user;
  }
}
