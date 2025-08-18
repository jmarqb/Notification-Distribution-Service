import { DynamicModule, Global, Module } from '@nestjs/common';
import { envs } from '../config';
import RedisClient from 'ioredis';
import { REDIS_CLIENT } from './constants/redis-client';

@Global()
@Module({})
export class RedisModule {
  static register(): DynamicModule {
    const providers = [
      {
        provide: REDIS_CLIENT,
        useFactory: () => {
          const client = new RedisClient({
            host: envs.redis_host,
            port: envs.redis_port,
          });
          client.on('connect', () => console.log('Connect to Redis'));
          client.on('error', (error) => console.error('Error in Redis', error));
          return client;
        },
      },
    ];

    return {
      module: RedisModule,
      providers: providers,
      exports: providers,
    };
  }
}
