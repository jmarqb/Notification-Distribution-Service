import { Transporter } from 'nodemailer';

export interface EmailProviderInterface {
  createTransport(): Transporter;

  getDefaultFrom(): string;
}
