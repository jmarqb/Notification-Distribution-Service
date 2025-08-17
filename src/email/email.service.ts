import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EmailFactory } from './providers';
import { envs } from '../config';
import { EmailProviderInterface, SendEmailOptions } from './interfaces';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;
  private provider: EmailProviderInterface;

  onModuleInit() {
    this.provider = EmailFactory.createProvider(envs.mailer_provider);
    this.transporter = this.provider.createTransport();
  }

  async sendEmail(options: SendEmailOptions) {
    const { to, subject, body, attachments } = options;
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized.');
      }
      await this.transporter.sendMail({
        from: this.provider.getDefaultFrom(),
        to,
        subject,
        html: body,
        attachments,
      });

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}