import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionResponse } from '../interfaces';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorData = exception.getResponse() as HttpExceptionResponse;

    let messages: string[] = [];
    if (Array.isArray(errorData.message)) {
      messages = errorData.message;
    } else {
      messages.push(errorData.message);
    }

    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      details: exception.getResponse() || null,
    };

    response.status(status).json(errorResponse);
  }
}
