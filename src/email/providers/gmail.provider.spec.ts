import { GmailProvider } from './gmail.provider';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

jest.mock('../../config', () => ({
  envs: {
    mailer_gmail_email: 'test@gmail.com',
    mailer_gmail_secret_key: 'test-secret',
  },
}));

describe('GmailProvider', () => {
  let gmailProvider: GmailProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    gmailProvider = new GmailProvider();
  });

  it('should call nodemailer.createTransport with correct Gmail configuration', () => {
    gmailProvider.createTransport();

    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'test@gmail.com',
        pass: 'test-secret',
      },
    });
  });
  it('should return the correct default "from" email', () => {
    const fromEmail = gmailProvider.getDefaultFrom();
    expect(fromEmail).toBe('test@gmail.com');
  });
});
