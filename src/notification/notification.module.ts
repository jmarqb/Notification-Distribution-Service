import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { IsUserExistConstraint } from './decorators';
import { User, UserSchema } from '../auth/entities/user.entity';
import { Notification, NotificationSchema } from './entities';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { RedisService } from '../redis/redis.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { TraceModule } from '../trace/trace.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    CommonModule,
    EmailModule,
    TraceModule,
  ],

  controllers: [NotificationController],
  providers: [
    NotificationService,
    IsUserExistConstraint,
    RedisService,
    EmailService,
  ],
})
export class NotificationModule {}
