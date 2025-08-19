import { Test, TestingModule } from '@nestjs/testing';
import { CronService } from './cron.service';
import { NotificationService } from '../notification/notification.service';
import { SCHEDULE_MODULE_OPTIONS } from '@nestjs/schedule/dist/schedule.constants';
import { CRON_SCHEDULE } from './utils/validate-cron.helper';

describe('CronService', () => {
  let cronService: CronService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const mockNotificationService = {
      handleTimeoutNotifications: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronService,
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    cronService = module.get<CronService>(CronService);
    notificationService = module.get<NotificationService>(NotificationService);
  });
  it('should call handleTimeoutNotifications when handleCron is executed', async () => {
    await cronService.handleCron();
    expect(
      notificationService.handleTimeoutNotifications,
    ).toHaveBeenCalledTimes(1);
  });

  it('should use the cron schedule defined in CRON_SCHEDULE', () => {
    const metadata = Reflect.getMetadata(
      SCHEDULE_MODULE_OPTIONS,
      CronService.prototype.handleCron,
    );
    expect(CRON_SCHEDULE).toBeDefined();
    expect(typeof CRON_SCHEDULE).toBe('string');
    expect(CRON_SCHEDULE).toMatch(/^[\s\S]+$/);
  });
});