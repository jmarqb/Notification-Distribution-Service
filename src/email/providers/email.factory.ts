import { GmailProvider } from './gmail.provider';
import { MailgunProvider } from './mailgun.provider';
import { EmailProviderInterface } from '../interfaces';

export class EmailFactory {
  static createProvider(providerName: string): EmailProviderInterface {
    switch (providerName.toLowerCase()) {
      case 'gmail':
        return new GmailProvider();
      case 'mailgun':
        return new MailgunProvider();
      default:
        throw new Error(`Email provider not supported ${providerName}`);
    }
  }
}
