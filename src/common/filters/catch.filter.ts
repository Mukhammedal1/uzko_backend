import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

const PG_ERRORS: Record<string, { status: number; message: string }> = {
  '23505': {
    status: HttpStatus.CONFLICT,
    message: 'Bu qiymat allaqachon mavjud',
  },
  '23503': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Bogʻliq maʼlumot topilmadi',
  },
  '23502': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Majburiy maydon toʻldirilmagan',
  },
  '23514': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Maʼlumot shartlarga mos emas',
  },
  '22P02': {
    status: HttpStatus.BAD_REQUEST,
    message: 'Maʼlumot formati notoʻgʻri',
  },
};

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
    }

    // ---- Postgres xatolari ----
    else if (exception instanceof QueryFailedError) {
      const code = (exception as any).code;
      const known = PG_ERRORS[code];

      if (known) {
        status = known.status;
        message = known.message;
        errorName = 'DatabaseError';
      } else {
        // noma'lum DB xatosi — foydalanuvchiga SQL ko'rsatmaymiz
        this.logger.error(`Unhandled PG error ${code}`, exception.stack);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Maʼlumotlar bazasida xatolik';
        errorName = 'DatabaseError';
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

    response.status(status).json({
      statusCode: status,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
