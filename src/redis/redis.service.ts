import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import RedisClient from 'ioredis';
import { CreateNotificationDto } from '../notification/dto';
import { REDIS_CLIENT } from './constants/redis-client';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClient,
  ) {}

  onModuleDestroy(): void {
    this.client.disconnect();
  }

  async addNotificationToBach(key: string, value: CreateNotificationDto) {
    try {
      const result = await this.client.rpush(
        `notification:${key}`,
        JSON.stringify(value),
      );
      this.logger.log(
        `Notification added successfully. Batch actually size : ${result}`,
      );
      return result;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async retrieveBatchNotifications(key: string) {
    this.logger.log(
      `Recovering notifications stored with key: notification:${key}`,
    );
    try {
      const notifications = await this.client.lrange(
        `notification:${key}`,
        0,
        -1,
      );
      this.logger.log(`Recovered ${notifications.length} notifications.`);
      return notifications.map((notification) => JSON.parse(notification));
    } catch (error) {
      this.handlerError(error);
    }
  }

  async removeBatchNotifications(key: string): Promise<void> {
    this.logger.log(
      `Deleting notifications from store with key: notification:${key}`,
    );
    try {
      await this.client.del(`notification:${key}`);
      this.logger.log(`Notifications deleted successfully.`);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async getListLength(key: string) {
    try {
      const length = await this.client.llen(key);
      this.logger.log(` List sizes for key: ${key} is ${length}`);
      return length;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async addHashToList(hash: string): Promise<void> {
    this.logger.log(`Adding hash ${hash} to active hashes list.`);
    try {
      await this.client.sadd('active_hashes', hash);
      this.logger.log(`Hash ${hash} added successfully.`);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async getAllActiveHashes() {
    try {
      const hashes = await this.client.smembers('active_hashes');
      this.logger.log(`Recovered ${hashes.length} active hashes.`);
      return hashes;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async removeHashFromList(hash: string): Promise<void> {
    try {
      await this.client.srem('active_hashes', hash);
      this.logger.log(`Hash ${hash} removed successfully.`);
    } catch (error) {
      this.handlerError(error);
    }
  }

  private handlerError(error: any) {
    this.logger.error('Error in Redis:', error);

    if (error.code) {
      switch (error.code) {
        case 'ETIMEDOUT':
          throw new InternalServerErrorException(
            'Timeout error in Redis during operation.',
          );
        case 'ECONNREFUSED':
          throw new InternalServerErrorException(
            'Connection to Redis refused. Make sure Redis is running properly.',
          );
        case 'ECONNRESET':
          throw new InternalServerErrorException(
            'Connection to Redis reset during operation.',
          );
        default:
          throw new InternalServerErrorException(
            `Unknown error in Redis with code ${error.code}.`,
          );
      }
    } else if (error.message) {
      if (error.message.includes('WRONGTYPE')) {
        throw new BadRequestException(
          'Operation not allowed on Redis key due to data type.',
        );
      } else if (error.message.includes('NOAUTH')) {
        throw new InternalServerErrorException(
          'Authentication required for Redis.',
        );
      } else if (error.message.includes('ERR')) {
        throw new BadRequestException(`Specific Redis error: ${error.message}`);
      } else {
        throw new InternalServerErrorException(
          `Unknown error in Redis: ${error.message}`,
        );
      }
    } else {
      throw new InternalServerErrorException('Unknown error in Redis.');
    }
  }
}
