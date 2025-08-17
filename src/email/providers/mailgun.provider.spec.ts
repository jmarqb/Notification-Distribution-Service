import * as nodemailer from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';
import { MailgunProvider } from './mailgun.provider';

jest.mock('nodemailer-mailgun-transport', () => jest.fn(() => ({})));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

jest.mock('../../config', () => ({
  envs: {
    app_email_mailgun_key: 'test-api-key',
    app_email_mailgun_domain: 'test-domain.com',
    app_email_mailgun_from: 'test@test-domain.com',
  },
}));

describe('MailgunProvider', () => {
  let mailgunProvider: MailgunProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    mailgunProvider = new MailgunProvider();
  });

  it('should call nodemailer.createTransport with the Mailgun API configuration', () => {
    mailgunProvider.createTransport();

    expect(mg).toHaveBeenCalledWith({
      auth: {
        api_key: 'test-api-key',
        domain: 'test-domain.com',
      },
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({});
  });

  it('should return the correct default "from" email', () => {
    const fromEmail = mailgunProvider.getDefaultFrom();
    expect(fromEmail).toBe('test@test-domain.com');
  });
});