import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: PinoLogger);
    catch(exception: unknown, host: ArgumentsHost): void;
    private resolveMessage;
}
