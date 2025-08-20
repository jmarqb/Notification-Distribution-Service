import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { TraceService } from '../trace/trace.service';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from './entities';
import { CreateNotificationDto } from './dto';
import { DeliveryChannel, NotificationType } from './constants';
import { NotFoundException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockRedisService = {
    addNotificationToBach: jest.fn(),
    retrieveBatchNotifications: jest.fn(),
    removeBatchNotifications: jest.fn(),
    getListLength: jest.fn(),
    addHashToList: jest.fn(),
    getAllActiveHashes: jest.fn(),
    removeHashFromList: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };
  const mockTraceService = {
    create: jest.fn(),
  };

  const mockNotificationModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    countDocuments: jest.fn(),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    findOneAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
  };

  jest.mock('../config', () => ({
    envs: {
      mailer_provider: 'gmail',
    },
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: RedisService, useValue: mockRedisService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: TraceService, useValue: mockTraceService },
        {
          provide: getModelToken(Notification.name),
          useValue: mockNotificationModel,
        },
        NotificationService,
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should process and save a batch email notification', async () => {
      const dto: CreateNotificationDto = {
        eventEmitted: 'event',
        deliveryChannel: DeliveryChannel.Email,
        notificationType: NotificationType.Batch,
        email: 'test@example.com',
        content: 'Test Content',
      };

      mockRedisService.addNotificationToBach.mockResolvedValue(1);
      mockRedisService.getAllActiveHashes.mockResolvedValue([]);
      mockRedisService.getListLength.mockResolvedValue(1);

      const result = await service.create(dto);

      expect(mockRedisService.addNotificationToBach).toHaveBeenCalled();
      expect(result?.message).toBe('Batch notification processed');
    });

    it('should send an instant email notification', async () => {
      const dto: CreateNotificationDto = {
        eventEmitted: 'event',
        deliveryChannel: DeliveryChannel.Email,
        notificationType: NotificationType.Instant,
        email: 'test@example.com',
        content: 'Test Content',
      };

      await service.create(dto);

      expect(mockEmailService.sendEmail).toHaveBeenCalled();
    });

    it('should save a system notification', async () => {
      const dto: CreateNotificationDto = {
        eventEmitted: 'event',
        deliveryChannel: DeliveryChannel.System,
        notificationType: NotificationType.Instant,
        userId: '12345',
        content: 'Test Content',
      };

      await service.create(dto);

      expect(mockNotificationModel.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const mockPaginationDto = {
      limit: 5,
      offset: 0,
    };
    it('should retrieve all notifications', async () => {
      const mocknotifications = [
        {
          _id: '65344e60c81f09477a7957e4',
          date: '2023-10-21T22:19:12.479Z',
          eventEmitted: 'Event_nuevo',
          deliveryChannel: 'System',
          notificationType: 'Batch',
          systemMetadata: {
            userId: 'c573e986-fb91-475c-9043-1b4c05bec643',
            content: 'test_content',
            _id: '65344e60c81f09477a7957e5',
          },
          read: false,
        },
        {
          _id: '62355e60c30f09477a7957e4',
          date: '2023-10-21T22:19:12.479Z',
          eventEmitted: 'Event_test',
          deliveryChannel: 'System',
          notificationType: 'Instant',
          systemMetadata: {
            userId: 'c573e986-fb91-475c-9043-1b4c05bec643',
            content: 'test_content',
            _id: '65344e60c81f09477a7957e5',
          },
          read: true,
        },
      ];

      const mockFind = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mocknotifications),
      };

      (mockNotificationModel.find as jest.Mock).mockReturnValue(mockFind);
      (mockNotificationModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(20),
      });

      const result = await service.findAll(mockPaginationDto);

      expect(mockNotificationModel.find).toHaveBeenCalled();
      expect(mockFind.skip).toHaveBeenCalledWith(
        Number(mockPaginationDto.offset),
      );
      expect(mockFind.limit).toHaveBeenCalledWith(
        Number(mockPaginationDto.limit),
      );

      expect(result).toEqual({
        items: mocknotifications,
        total: 20,
        currentPage: 1,
        totalPages: 4,
      });
    });
  });

  describe('findOne', () => {
    it('should return a notification by id', async () => {
      const mockNotification = {
        eventEmitted: 'Event1',
        deliveryChannel: DeliveryChannel.System,
        notificationType: NotificationType.Instant,
        content: 'Sample Content',
      };
      const filter = { _id: '12345', deleted: false };

      (mockNotificationModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });

      const result = await service.findOne('12345');
      expect(mockNotificationModel.findOne).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockNotification);
    });

    it('should throw NotFoundException if notification is not found', async () => {
      (mockNotificationModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('12345')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findNotificationByUserId', () => {
    it('should return notifications by user id', async () => {
      const mockDocs = [
        {
          content: 'Sample Content',
          deliveryChannel: 'System',
          eventEmitted: 'Event1',
          notificationType: 'Instant',
        },
      ];

      (mockNotificationModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDocs),
      });

      const result = await service.findNotificationsByUserId('12345');

      expect(mockNotificationModel.find).toHaveBeenCalledWith({
        'metadata.userId': '12345',
        deleted: false,
      });

      expect(result).toEqual({
        items: mockDocs,
        total: 1,
      });
    });

    it('should throw NotFoundException if no notifications for this userId', async () => {
      (mockNotificationModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await expect(service.findNotificationsByUserId('12345')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a notification by id', async () => {
      const mockNotification = {
        _id: '12345',
        eventEmitted: 'Event1',
        deliveryChannel: DeliveryChannel.System,
        notificationType: NotificationType.Instant,
        content: 'Sample Content',
      };

      (mockNotificationModel.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });

      const result = await service.remove('12345');
      expect(mockNotificationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '12345', deleted: false },
        {
          $set: {
            deleted: true,
            deletedAt: expect.any(Date),
          },
        },
        { new: true },
      );
      expect(result).toEqual({ acknowledge: true, deletedCount: 1 });
    });
  });

  describe('setReadStatus', () => {
    it('should set read status and return updated notification', async () => {
      const mockNotification = {
        _id: '12345',
        read: true,
      } as Notification;

      (mockNotificationModel.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotification),
      });

      const result = await service.setReadStatus('12345', true);
      expect(mockNotificationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '12345', deleted: false },
        {
          $set: {
            read: true,
          },
        },
        { new: true },
      );
      expect(result.read).toBe(true);
      expect(result).toEqual(mockNotification);
    });
  });

  describe('saveBatchNotification', () => {
    it('should save the batch notification', async () => {
      const mockNotification = {
        eventEmitted: 'event',
        deliveryChannel: DeliveryChannel.System,
        notificationType: NotificationType.Instant,
        userId: '12345',
        content: 'Test Content',
      };

      await service.saveBatchNotification(mockNotification);

      expect(mockRedisService.addNotificationToBach).toHaveBeenCalled();
      expect(mockRedisService.addHashToList).toHaveBeenCalled();
    });
  });

  describe('combineNotifications', () => {
    it('should combine multiple notifications', () => {
      const notifications = [
        {
          content: 'Content1',
          eventEmitted: 'event',
          deliveryChannel: DeliveryChannel.System,
          notificationType: NotificationType.Instant,
          userId: '12345',
        },
        {
          eventEmitted: 'event',
          deliveryChannel: DeliveryChannel.System,
          notificationType: NotificationType.Instant,
          userId: '12345',
          content: 'Content2',
        },
        {
          eventEmitted: 'event',
          deliveryChannel: DeliveryChannel.System,
          notificationType: NotificationType.Instant,
          userId: '12345',
          content: 'Content3',
        },
      ];

      const combined = service.combineNotifications(notifications);

      expect(combined).toBe('Content1\n\nContent2\n\nContent3');
    });
  });

  describe('processBatchNotification', () => {
    it('should process the batch notification', async () => {
      const mockNotifications = [
        { email: 'test@example.com', content: 'Content1' },
      ];

      mockRedisService.retrieveBatchNotifications.mockResolvedValueOnce(
        mockNotifications,
      );

      await service.processBatchNotification('somehash');

      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      expect(mockRedisService.removeBatchNotifications).toHaveBeenCalled();
    });
  });

  describe('handleNotification', () => {
    const notifications = [
      {
        content: 'Content1',
        eventEmitted: 'event',
        deliveryChannel: DeliveryChannel.System,
        notificationType: NotificationType.Instant,
        userId: '12345',
      },
      {
        eventEmitted: 'event',
        deliveryChannel: DeliveryChannel.System,
        notificationType: NotificationType.Instant,
        userId: '12345',
        content: 'Content2',
      },
      {
        eventEmitted: 'event',
        deliveryChannel: DeliveryChannel.System,
        notificationType: NotificationType.Instant,
        userId: '12345',
        content: 'Content3',
      },
    ];
    it('should handle notifications correctly', async () => {
      const mockHashes = ['hash1', 'hash2'];
      mockRedisService.getAllActiveHashes.mockResolvedValueOnce(mockHashes);
      mockRedisService.getListLength.mockResolvedValueOnce(6);
      mockRedisService.retrieveBatchNotifications.mockResolvedValueOnce(
        notifications,
      );

      await service.handleNotification();

      expect(mockRedisService.getListLength).toHaveBeenCalledTimes(
        mockHashes.length,
      );
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      expect(mockRedisService.removeBatchNotifications).toHaveBeenCalledTimes(
        mockHashes.length,
      );
    });
  });

  describe('handleTimeoutNotifications', () => {
    it('should process and clean up all hashes', async () => {
      const mockHashes = ['hash1', 'hash2'];

      mockRedisService.getAllActiveHashes.mockResolvedValueOnce(mockHashes);
      mockRedisService.getListLength.mockResolvedValue(3);

      const processBatchNotificationSpy = jest
        .spyOn(service, 'processBatchNotification')
        .mockResolvedValue(undefined);

      const removeProcessedBatchSpy = jest
        .spyOn(service, 'removeProcessedBatch')
        .mockResolvedValue(undefined);

      mockRedisService.removeHashFromList.mockResolvedValue(undefined);

      await service.handleTimeoutNotifications();

      expect(mockRedisService.getAllActiveHashes).toHaveBeenCalledTimes(1);

      expect(mockRedisService.getListLength).toHaveBeenCalledTimes(
        mockHashes.length,
      );
      expect(mockRedisService.getListLength).toHaveBeenCalledWith(
        'notification:hash1',
      );
      expect(mockRedisService.getListLength).toHaveBeenCalledWith(
        'notification:hash2',
      );

      expect(processBatchNotificationSpy).toHaveBeenCalledTimes(
        mockHashes.length,
      );
      expect(removeProcessedBatchSpy).toHaveBeenCalledTimes(mockHashes.length);

      expect(mockRedisService.removeHashFromList).toHaveBeenCalledTimes(
        mockHashes.length,
      );
      expect(mockRedisService.removeHashFromList).toHaveBeenCalledWith('hash1');
      expect(mockRedisService.removeHashFromList).toHaveBeenCalledWith('hash2');
    });

    it('should log an error if something goes wrong', async () => {
      mockRedisService.getAllActiveHashes.mockRejectedValue(
        new Error('Redis error'),
      );
      const loggerSpy = jest
        .spyOn(service['logger'], 'error')
        .mockImplementation();

      await service.handleTimeoutNotifications();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error processing notifications'),
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
