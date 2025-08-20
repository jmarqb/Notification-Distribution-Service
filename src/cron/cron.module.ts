import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { CronService } from './cron.service';

@Module({
  imports: [NotificationModule],
  providers: [CronService],
})
export class CronModule {}
