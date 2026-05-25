"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const path = require("path");
const express = require("express");
const swagger_1 = require("@nestjs/swagger");
const nestjs_pino_1 = require("nestjs-pino");
const request_id_middleware_1 = require("./common/middleware/request-id.middleware");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const http_logging_interceptor_1 = require("./common/interceptors/http-logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const pinoLogger = await app.resolve(nestjs_pino_1.PinoLogger);
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(pinoLogger));
    app.useGlobalInterceptors(new http_logging_interceptor_1.HttpLoggingInterceptor(pinoLogger));
    const redisHost = process.env.REDIS_HOST ?? 'localhost';
    const redisPort = Number(process.env.REDIS_PORT ?? 6379);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.use(request_id_middleware_1.requestIdMiddleware);
    app.use(cookieParser());
    const uploadsPath = path.join(process.cwd(), 'uploads');
    app.use('/uploads', express.static(uploadsPath));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Questflow API')
        .setDescription('OpenAPI documentation for the Questflow backend')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, swaggerDocument);
    app.connectMicroservice({
        transport: microservices_1.Transport.REDIS,
        options: {
            host: redisHost,
            port: redisPort,
        },
    });
    try {
        await app.startAllMicroservices();
    }
    catch (e) {
        console.warn('[bootstrap] Redis microservice failed to start. Continuing without it.', e);
    }
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map