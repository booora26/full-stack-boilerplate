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

    console.log('uhvacena greska', exception);

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }

    if (
      ['23502', '23514', '22P02', 'ERR_INVALID_ARG_TYPE'].includes(
        exception.code,
      )
    ) {
      statusCode = 400;
      message =
        'Oops! Something went wrong with your input. Please check your provided values and ensure they meet the required criteria.';
    }
    if (exception.code == 42883) {
      statusCode = 400;
      message =
        'Unable to perform the operation. Please check the provided values and ensure they are of compatible types.';
    }
    if (exception.code == 23505) {
      statusCode = 409;
      message =
        'Sorry, the provided data conflicts with existing records. Please ensure that your input is unique and does not duplicate existing values.';
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
