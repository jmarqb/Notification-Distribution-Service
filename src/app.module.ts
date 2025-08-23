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
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisNamespacesPrefix } from './redis/constants';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    SentryModule.forRoot(),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisUri = `redis://${envs.redis_host}:${envs.redis_port}`;
        const redisStore = new KeyvRedis(redisUri, {
          namespace: RedisNamespacesPrefix.CACHE,
        });
        const keyv = new Keyv(redisStore);
        return { store: keyv };
      },
    }),

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
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
