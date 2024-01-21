import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }

    if (
      exception.code == 23502 ||
      exception.code == 23514 ||
      exception.code == '22P02' ||
      exception.code == 'ERR_INVALID_ARG_TYPE'
    ) {
      statusCode = 400;
      message = 'Invalid input data.';
    }
    if (exception.code == 23505) {
      statusCode = 409;
      message = 'Item already exists.';
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
