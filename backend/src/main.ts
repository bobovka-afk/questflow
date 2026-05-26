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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pinoLogger = await app.resolve(PinoLogger);
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpExceptionFilter(pinoLogger));
  app.useGlobalInterceptors(new HttpLoggingInterceptor(pinoLogger));

  const redisHost = process.env.REDIS_HOST ?? 'localhost';
  const redisPort = Number(process.env.REDIS_PORT ?? 6379);

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(requestIdMiddleware);
  app.use(cookieParser());


  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

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
          return [`Лишнее поле: ${error.property}`];
        });
        const message =
          messages.length <= 1
            ? (messages[0] ?? 'Ошибка проверки данных')
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
    options: {
      host: redisHost,
      port: redisPort,
    },
  });

  try {
    await app.startAllMicroservices();
  } catch (e) {
    // Allow HTTP API to work even if Redis is down in local dev.
    // eslint-disable-next-line no-console
    console.warn('[bootstrap] Redis microservice failed to start. Continuing without it.', e);
  }
  await app.listen(3000);
}

bootstrap();
