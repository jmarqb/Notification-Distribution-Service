import 'dotenv/config';
import * as joi from 'joi';
import * as process from 'process';

interface EnvVars {
  PORT: number;
  MONGO_CNN: string;
  REDIS_PORT: number;
  REDIS_HOST: string;
  JWT_SECRET: string;
  MAILER_PROVIDER: string;
  MAILER_GMAIL_EMAIL: string;
  MAILER_GMAIL_SECRET_KEY: string;
  APP_EMAIL_MAILGUN_FROM: string;
  APP_EMAIL_MAILGUN_KEY: string;
  APP_EMAIL_MAILGUN_DOMAIN: string;
  APP_EMAIL_MAILGUN_USERNAME: string;
  NOTIFICATIONS_BATCH_SIZE_LIMIT: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_CNN: joi.string().required(),
    REDIS_PORT: joi.number().required(),
    REDIS_HOST: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    MAILER_PROVIDER: joi.string().required(),
    MAILER_GMAIL_EMAIL: joi.string().required(),
    MAILER_GMAIL_SECRET_KEY: joi.string().required(),
    APP_EMAIL_MAILGUN_FROM: joi.string().required(),
    APP_EMAIL_MAILGUN_KEY: joi.string().required(),
    APP_EMAIL_MAILGUN_DOMAIN: joi.string().required(),
    APP_EMAIL_MAILGUN_USERNAME: joi.string().required(),
    NOTIFICATIONS_BATCH_SIZE_LIMIT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  PORT: process.env.PORT,
  MONGO_CNN: process.env.MONGO_CNN,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  JWT_SECRET: process.env.JWT_SECRET,
  MAILER_PROVIDER: process.env.MAILER_PROVIDER,
  MAILER_GMAIL_EMAIL: process.env.MAILER_GMAIL_EMAIL,
  MAILER_GMAIL_SECRET_KEY: process.env.MAILER_GMAIL_SECRET_KEY,
  APP_EMAIL_MAILGUN_FROM: process.env.APP_EMAIL_MAILGUN_FROM,
  APP_EMAIL_MAILGUN_KEY: process.env.APP_EMAIL_MAILGUN_KEY,
  APP_EMAIL_MAILGUN_DOMAIN: process.env.APP_EMAIL_MAILGUN_DOMAIN,
  APP_EMAIL_MAILGUN_USERNAME: process.env.APP_EMAIL_MAILGUN_USERNAME,
  NOTIFICATIONS_BATCH_SIZE_LIMIT: process.env.NOTIFICATIONS_BATCH_SIZE_LIMIT,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongo_cnn: envVars.MONGO_CNN,
  redis_port: envVars.REDIS_PORT,
  redis_host: envVars.REDIS_HOST,
  jwt_secret: envVars.JWT_SECRET,
  mailer_provider: envVars.MAILER_PROVIDER,
  mailer_gmail_email: envVars.MAILER_GMAIL_EMAIL,
  mailer_gmail_secret_key: envVars.MAILER_GMAIL_SECRET_KEY,
  app_email_mailgun_from: envVars.APP_EMAIL_MAILGUN_FROM,
  app_email_mailgun_key: envVars.APP_EMAIL_MAILGUN_KEY,
  app_email_mailgun_domain: envVars.APP_EMAIL_MAILGUN_DOMAIN,
  app_email_mailgun_username: envVars.APP_EMAIL_MAILGUN_USERNAME,
  notifications_batch_size_limit: envVars.NOTIFICATIONS_BATCH_SIZE_LIMIT,
};
