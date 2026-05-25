import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
export declare class HttpLoggingInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly skippedPaths;
    constructor(logger: PinoLogger);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
    private logRequest;
    private shouldSkip;
}
