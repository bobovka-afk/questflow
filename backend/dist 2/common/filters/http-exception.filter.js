"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
        this.logger.setContext(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        const isHttpException = exception instanceof common_1.HttpException;
        const statusCode = isHttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = isHttpException ? exception.getResponse() : null;
        const message = this.resolveMessage(statusCode, exceptionResponse);
        const errorCode = exceptionResponse &&
            typeof exceptionResponse === 'object' &&
            typeof exceptionResponse.code === 'string'
            ? exceptionResponse.code
            : undefined;
        const requestId = req.id ??
            (Array.isArray(req.headers['x-request-id'])
                ? req.headers['x-request-id'][0]
                : req.headers['x-request-id']);
        this.logger.error({
            requestId,
            method: req.method,
            path: req.originalUrl ?? req.url,
            statusCode,
            userId: req.user?.id,
            err: exception instanceof Error
                ? {
                    name: exception.name,
                    message: exception.message,
                    stack: exception.stack,
                }
                : { message: String(exception) },
        }, 'Request failed');
        res.status(statusCode).json({
            statusCode,
            message,
            ...(errorCode ? { code: errorCode } : {}),
            path: req.originalUrl ?? req.url,
            timestamp: new Date().toISOString(),
            requestId,
        });
    }
    resolveMessage(statusCode, exceptionResponse) {
        const isGateway = statusCode === common_1.HttpStatus.BAD_GATEWAY ||
            statusCode === common_1.HttpStatus.SERVICE_UNAVAILABLE;
        if (exceptionResponse && typeof exceptionResponse === 'object') {
            const raw = exceptionResponse.message;
            if (isGateway) {
                if (typeof raw === 'string')
                    return raw;
                if (Array.isArray(raw))
                    return raw.join(', ');
            }
            if (statusCode >= 500) {
                return 'Internal server error';
            }
            if (typeof raw === 'string')
                return raw;
            if (Array.isArray(raw))
                return raw.join(', ');
            return raw ?? 'Request failed';
        }
        if (statusCode >= 500) {
            return 'Internal server error';
        }
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }
        return 'Request failed';
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map