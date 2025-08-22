import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TraceModule } from './trace/trace.module';
import { envs } from './config';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { SentryGlobalExceptionFilter } from './common/filters';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    SentryModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: envs.mongo_cnn,
      }),
    }),
    AuthModule,
    CommonModule,
    TraceModule,
    EmailModule,
    RedisModule.register(),
    NotificationModule,
    ScheduleModule.forRoot(),
    CronModule,
  ],
  controllers: [],
  providers: [
    CronService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
