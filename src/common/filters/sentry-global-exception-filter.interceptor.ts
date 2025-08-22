import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class SentryGlobalExceptionFilter extends BaseExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    Sentry.captureException(exception);

    const message = exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
