import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto';
import {
  computeNotificationHash,
  DeleteResponseDto,
  generateUUID,
  PaginationDto,
  PaginationResponseDto,
} from '../common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './entities';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { TraceService } from '../trace/trace.service';
import { DeliveryChannel, NotificationType } from './constants';
import { envs } from '../config';
import { ProcessingTraceStatusEnum } from '../trace/constants/processing-trace-status.enum';
import { RedisNamespacesPrefix } from '../redis/constants';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly traceService: TraceService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { deliveryChannel, notificationType, content } =
      createNotificationDto;

    this.logger.log(
      `New notification with delivery channel: ${createNotificationDto.deliveryChannel} 
      and Type: ${createNotificationDto.notificationType}`,
    );

    if (
      deliveryChannel === DeliveryChannel.Email &&
      notificationType === NotificationType.Batch
    ) {
      await this.saveBatchNotification(createNotificationDto);
      await this.handleNotification();
      return { message: 'Batch notification processed' };
    }

    if (
      deliveryChannel === DeliveryChannel.Email &&
      notificationType === NotificationType.Instant
    ) {
      return await this.processNotificationByEmailAndInstant(
        createNotificationDto,
      );
    } else if (deliveryChannel === DeliveryChannel.System) {
      return await this.processNotificationBySystem(createNotificationDto);
    }
  }

  async processNotificationBySystem(
    createNotificationDto: CreateNotificationDto,
  ) {
    let successMessage: string;
    let errorMessage: string;
    try {
      createNotificationDto._id = generateUUID();
      await this.notificationModel.create({
        ...createNotificationDto,
        metadata: {
          userId: createNotificationDto.userId,
          content: createNotificationDto.content,
        },
      });

      successMessage =
        'System notification processed and saved in the database.';
      this.logger.log(successMessage);

      await this.saveTrace(createNotificationDto, successMessage);

      return {
        message: successMessage,
      };
    } catch (error) {
      errorMessage = `Failed processed notification ${error}`;
      this.logger.error(errorMessage);
      await this.saveTrace(createNotificationDto, errorMessage);
      throw error;
    }
  }

  async processNotificationByEmailAndInstant(
    createNotificationDto: CreateNotificationDto,
  ) {
    let successMessage: string;
    let errorMessage: string;
    try {
      await this.emailService.sendEmail({
        to: `${createNotificationDto.email}`,
        subject: 'Distribution Notification Service',
        body: createNotificationDto.content,
      });
      successMessage = 'Email sent successfully.Instant notification processed';
      this.logger.log(successMessage);

      await this.saveTrace(createNotificationDto, successMessage);

      return { message: successMessage };
    } catch (error) {
      errorMessage = `Error sending email: ${error}`;

      this.logger.error(errorMessage);

      await this.saveTrace(createNotificationDto, errorMessage);

      throw new BadRequestException(errorMessage);
    }
  }

  async handleTimeoutNotifications() {
    try {
      this.logger.log('Checking pending notifications...');

      const allHashes = (await this.redisService.getAllActiveHashes()) ?? [];
      this.logger.log(
        `Retrieved ${allHashes?.length} hashes of the notification stored.`,
      );
      for (const hash of allHashes) {
        const listLength = await this.redisService.getListLength(
          `${RedisNamespacesPrefix.NOTIFICATION}:${hash}`,
        );
        this.logger.log(`Hash ${hash} has ${listLength} notifications.`);

        await this.processBatchNotification(hash);

        this.logger.log(
          `Notification with hash ${hash} processed successfully.`,
        );

        await this.removeProcessedBatch(hash);
        this.logger.log(`Notification with hash ${hash} removed from store.`);

        await this.redisService.removeHashFromList(hash);
        this.logger.log(`Hash ${hash} removed from the list of active hashes.`);
      }
    } catch (error) {
      this.logger.error(`Error processing notifications: ${error.details}`);
    }
  }

  async handleNotification() {
    //Get all the hashes (keys) of the notifications stored in Redis.
    const allHashes = (await this.redisService.getAllActiveHashes()) ?? [];
    this.logger.log(
      `Retrieved ${allHashes?.length} hashes of the notification stored.`,
    );

    for (const hash of allHashes) {
      //For each hash, check if the notification has exceeded the batch size.
      const listLength =
        (await this.redisService.getListLength(
          `${RedisNamespacesPrefix.NOTIFICATION}:${hash}`,
        )) ?? 0;
      this.logger.log(`Hash ${hash} has ${listLength} notifications.`);

      if (listLength >= envs.notifications_batch_size_limit) {
        //Process the notification after time has ended
        await this.processBatchNotification(hash);
        this.logger.log(
          `Notification with hash ${hash} processed successfully.`,
        );

        //Delete the processed notification from Redis.
        await this.removeProcessedBatch(hash);
        this.logger.log(`Notification with hash ${hash} removed from store.`);

        //Remove the hash from the list of active hashes.
        await this.redisService.removeHashFromList(hash);
        this.logger.log(`Hash ${hash} removed from the list of active hashes.`);
      }
    }
  }

  async saveBatchNotification(notification: CreateNotificationDto) {
    const hash = computeNotificationHash(
      notification.eventEmitted,
      notification.deliveryChannel,
      notification?.email || notification?.userId,
    );
    this.logger.log(
      `Storing notification with hash: ${hash}. Detail: ${JSON.stringify(
        notification.eventEmitted,
      )}`,
    );
    await this.redisService.addNotificationToBach(hash, notification);
    await this.redisService.addHashToList(hash);
  }

  combineNotifications(notifications: CreateNotificationDto[]): string {
    return notifications
      .map((notification) => notification.content)
      .join('\n\n');
  }

  // Deletes processed notifications from a batch in Redis
  async removeProcessedBatch(hash: string) {
    await this.redisService.removeBatchNotifications(hash);
  }

  // Processes batch notifications, combines them, and sends them based on the delivery channel
  async processBatchNotification(hash: string) {
    const notifications =
      await this.redisService.retrieveBatchNotifications(hash);
    if (notifications && notifications.length > 0) {
      const combinedMessage = this.combineNotifications(notifications);

      const recipientEmail = notifications[0]?.email;

      this.logger.log(`Processing notifications with hash ${hash}.`);

      try {
        await this.emailService.sendEmail({
          to: recipientEmail,
          subject: 'Distribution Notification Service',
          body: combinedMessage,
        });
        this.logger.log('Email sent successfully.');

        await this.saveTrace(notifications[0], 'Email sent successfully.');
      } catch (error) {
        const errorMessage = `Error sending email: ${error}`;
        this.logger.error(errorMessage);
        await this.saveTrace(notifications[0], errorMessage);
        throw new BadRequestException(errorMessage);
      }
      // Delete the processed notifications from Redis
      await this.removeProcessedBatch(hash);
    }
  }

  private async saveTrace(dto: CreateNotificationDto, description: string) {
    await this.traceService.create({
      _id: generateUUID(),
      processingStatus: ProcessingTraceStatusEnum.SUCCESS,
      description,
      info: {
        userId: dto?.userId,
        email: dto?.email,
        notificationType: dto?.notificationType,
        deliveryChannel: dto?.deliveryChannel,
        eventEmitted: dto?.eventEmitted,
      },
    });
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<Notification>> {
    let { page, limit } = paginationDto;
    page == null ? (page = 1) : page;
    limit == null ? (limit = 10) : limit;

    const offset = (page - 1) * limit;

    const filter = { deleted: false };
    const notifications = await this.notificationModel
      .find(filter)
      .skip(Number(offset))
      .limit(Number(limit))
      .exec();

    const total = await this.notificationModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);

    return {
      items: notifications,
      total,
      currentPage: page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Notification> {
    try {
      const notification = await this.notificationModel
        .findOne({
          _id: id,
          deleted: false,
        })
        .exec();

      if (!notification) {
        throw new NotFoundException(
          `Notification with ID ${id} not found in the database`,
        );
      }
      return notification;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findNotificationsByUserId(userId: string) {
    try {
      const notifications = await this.notificationModel
        .find({
          'metadata.userId': userId,
          deleted: false,
        })
        .exec();

      if (notifications.length === 0) {
        const message = 'User not found or no notifications for this userId.';
        this.logger.error(message);
        throw new NotFoundException(message);
      }
      return {
        items: notifications,
        total: notifications.length,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async setReadStatus(id: string, status: boolean) {
    try {
      const notification = await this.notificationModel
        .findOneAndUpdate(
          {
            _id: id,
            deleted: false,
          },
          { $set: { read: status } },
          { new: true },
        )
        .exec();
      if (!notification) {
        throw new NotFoundException(
          `Notification with ID ${id} not found in the database`,
        );
      }
      return notification;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async remove(id: string): Promise<DeleteResponseDto> {
    try {
      const updatedNotification = await this.notificationModel
        .findOneAndUpdate(
          {
            _id: id,
            deleted: false,
          },
          {
            $set: {
              deleted: true,
              deletedAt: new Date(),
            },
          },
          { new: true },
        )
        .exec();

      const deletedCount = updatedNotification ? 1 : 0;

      return {
        acknowledge: true,
        deletedCount,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
