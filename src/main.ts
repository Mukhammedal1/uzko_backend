import * as dotenv from 'dotenv';
dotenv.config();

import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ExpressLoggerInterceptor } from '@infrastructure';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from '@modules';
import { ExpressExceptionFilter } from '@common';
import { appConfig } from '@configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: '50mb' }));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-auth-token'],
    exposedHeaders: ['x-auth-token'],
  });
  app.enableVersioning();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formatErrors = (errs: ValidationError[]): string[] => {
          return errs.flatMap((err) => {
            const messages = err.constraints
              ? Object.values(err.constraints)
              : [];
            const childMessages = err.children?.length
              ? formatErrors(err.children)
              : [];
            return [...messages, ...childMessages];
          });
        };

        const messages = formatErrors(errors);

        return new BadRequestException(messages[0]);
      },
    }),
  );
  app.useGlobalFilters(new ExpressExceptionFilter());
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  // app.useGlobalInterceptors(
  //   new ExpressLoggerInterceptor({
  //     service: 'u-agro',
  //     hostname: 'u-agro',
  //   }),
  // );

  const config = new DocumentBuilder()
    .setTitle('Uzko API')
    .setDescription('starting point for uzko api documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document, {
    explorer: true,
    swaggerOptions: { docExpansion: 'none' },
    jsonDocumentUrl: 'api-docs',
  });

  await app.listen(appConfig.port, () =>
    console.log(
      `Server started on port ${appConfig.port} and docs ===> http://localhost:${appConfig.port}/api/docs`,
    ),
  );
}

bootstrap();
