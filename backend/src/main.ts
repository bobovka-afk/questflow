import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as path from 'path';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, PinoLogger } from 'nestjs-pino';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { resolveRedisMicroserviceOptions } from './redis/redis-connection';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Logger);
  const pinoLogger = await app.resolve(PinoLogger);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(pinoLogger));
  app.useGlobalInterceptors(new HttpLoggingInterceptor(pinoLogger));

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(requestIdMiddleware);
  app.use(cookieParser());


  const uploadsPath = path.join(process.cwd(), 'uploads');
  const staticUploadDirs = [
    'ui',
    'chests',
    'character-avatars',
    'cosmetics',
  ] as const;
  const volatileUploadDirs = ['user-avatars', 'card-attachments'] as const;

  for (const dir of staticUploadDirs) {
    app.use(
      `/uploads/${dir}`,
      express.static(path.join(uploadsPath, dir), {
        maxAge: '30d',
        immutable: true,
        etag: true,
        lastModified: true,
      }),
    );
  }
  for (const dir of volatileUploadDirs) {
    app.use(
      `/uploads/${dir}`,
      express.static(path.join(uploadsPath, dir), {
        maxAge: '1h',
        etag: true,
        lastModified: true,
      }),
    );
  }
  app.use(
    '/uploads',
    express.static(uploadsPath, {
      maxAge: '1h',
      etag: true,
      lastModified: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.flatMap((error) => {
          if (error.constraints) {
            return Object.values(error.constraints);
          }
          if (error.children?.length) {
            return error.children.flatMap((child) =>
              child.constraints ? Object.values(child.constraints) : [],
            );
          }
          return [`Unexpected field: ${error.property}`];
        });
        const message =
          messages.length <= 1
            ? (messages[0] ?? 'Validation failed')
            : messages;
        return new BadRequestException({
          code: 'VALIDATION_ERROR',
          message,
        });
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Questflow API')
    .setDescription('OpenAPI documentation for the Questflow backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: resolveRedisMicroserviceOptions(),
  });

  try {
    await app.startAllMicroservices();
  } catch (e) {
    logger.warn(
      { err: e },
      'Redis microservice failed to start. Continuing without it.',
    );
  }
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
