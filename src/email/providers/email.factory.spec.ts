import { EmailFactory } from './email.factory';
import { GmailProvider } from './gmail.provider';
import { MailgunProvider } from './mailgun.provider';

jest.mock('./gmail.provider');
jest.mock('./mailgun.provider');

describe('EmailFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a GmailProvider instance when given "gmail"', () => {
    const provider = EmailFactory.createProvider('gmail');

    expect(provider).toBeInstanceOf(GmailProvider);

    expect(GmailProvider).toHaveBeenCalledTimes(1);
    expect(MailgunProvider).not.toHaveBeenCalled();
  });

  it('should return a MailgunProvider instance when given "mailgun"', () => {
    const provider = EmailFactory.createProvider('mailgun');

    expect(provider).toBeInstanceOf(MailgunProvider);

    expect(MailgunProvider).toHaveBeenCalledTimes(1);
    expect(GmailProvider).not.toHaveBeenCalled();
  });

  it('should throw an error for an unsupported provider', () => {
    expect(() => EmailFactory.createProvider('unsupported')).toThrow(
      'Email provider not supported unsupported',
    );
  });
});
