import { EmailProviderInterface } from '../interfaces';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';
import { envs } from '../../config';

export class MailgunProvider implements EmailProviderInterface {
  createTransport(): Transporter {
    const mailgunTransportOptions = {
      auth: {
        api_key: envs.app_email_mailgun_key,
        domain: envs.app_email_mailgun_domain,
      },
    };
    return nodemailer.createTransport(mg(mailgunTransportOptions));
  }

  getDefaultFrom(): string {
    return envs.app_email_mailgun_from;
  }
}
