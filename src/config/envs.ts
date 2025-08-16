import 'dotenv/config';
import * as joi from 'joi';
import * as process from 'process';

interface EnvVars {
  PORT: number;
  MONGO_CNN: string;
  REDIS_PORT: number;
  REDIS_HOST: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_CNN: joi.string().required(),
    REDIS_PORT: joi.number().required(),
    REDIS_HOST: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  PORT: process.env.PORT,
  MONGO_CNN: process.env.MONGO_CNN,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_HOST: process.env.REDIS_HOST,
  JWT_SECRET: process.env.JWT_SECRET,
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
};
