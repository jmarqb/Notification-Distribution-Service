import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { Cron } from '@nestjs/schedule';
import { CRON_SCHEDULE } from './utils/validate-cron.helper';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Cron(CRON_SCHEDULE)
  async handleCron() {
    this.logger.log('Cron job triggered');
    await this.notificationService.handleTimeoutNotifications();
  }
}
