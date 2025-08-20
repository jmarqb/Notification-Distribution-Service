import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { EmailProviderInterface } from './interfaces';
import { Transporter } from 'nodemailer';

const mockTransporter = {
  sendMail: jest.fn().mockResolvedValueOnce(true),
} as unknown as Transporter;

const mockProvider: EmailProviderInterface = {
  createTransport: jest.fn().mockReturnValue(mockTransporter),
  getDefaultFrom: jest.fn().mockReturnValue('mock@provider.com'),
};

jest.mock('./providers/email.factory', () => ({
  EmailFactory: {
    createProvider: jest.fn(() => mockProvider),
  },
}));

jest.mock('../config', () => ({
  envs: {
    mailer_provider: 'gmail',
  },
}));

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true if email is sent successfully', async () => {
    const options = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
      attachments: [],
    };
    const result = await service.sendEmail(options);
    expect(result).toBe(true);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: 'mock@provider.com',
      to: options.to,
      subject: options.subject,
      html: options.body,
      attachments: options.attachments,
    });
  });
});
