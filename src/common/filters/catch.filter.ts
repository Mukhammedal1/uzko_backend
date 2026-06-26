import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class ExpressExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExpressExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorName = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseBody = exceptionResponse as any;
        message = responseBody.message || exception.message;
        errorName = responseBody.error || exception.name;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorName = exception.name;
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Status: ${status} Error: ${JSON.stringify(message)}`,
        (exception as Error).stack,
      );
    }

    const responseBody = {
      statusCode: status,
      message: message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }
}
