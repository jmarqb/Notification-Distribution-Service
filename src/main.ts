import './config/instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import {
  HttpExceptionFilter,
  SentryGlobalExceptionFilter,
} from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix: string = '/api';

  app.setGlobalPrefix(prefix);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new SentryGlobalExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Notification Distribution Service API')
    .setDescription(
      'Microservice Designed to Receive, Process, and Deliver Notifications',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(envs.port);
}

bootstrap();