import { EmailProviderInterface } from '../interfaces';
import { envs } from '../../config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export class GmailProvider implements EmailProviderInterface {
  createTransport(): Transporter {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envs.mailer_gmail_email,
        pass: envs.mailer_gmail_secret_key,
      },
    });
  }

  getDefaultFrom(): string {
    return envs.mailer_gmail_email;
  }
}