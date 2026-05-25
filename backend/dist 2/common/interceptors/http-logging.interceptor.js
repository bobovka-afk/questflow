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
var HttpLoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const operators_1 = require("rxjs/operators");
let HttpLoggingInterceptor = HttpLoggingInterceptor_1 = class HttpLoggingInterceptor {
    logger;
    skippedPaths = new Set(['/health', '/ready']);
    constructor(logger) {
        this.logger = logger;
        this.logger.setContext(HttpLoggingInterceptor_1.name);
    }
    intercept(context, next) {
        if (context.getType() !== 'http') {
            return next.handle();
        }
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        const startedAt = Date.now();
        return next.handle().pipe((0, operators_1.finalize)(() => this.logRequest(req, res, startedAt)));
    }
    logRequest(req, res, startedAt) {
        const path = req.originalUrl ?? req.url;
        if (this.shouldSkip(path)) {
            return;
        }
        const requestId = req.id ??
            (Array.isArray(req.headers['x-request-id'])
                ? req.headers['x-request-id'][0]
                : req.headers['x-request-id']);
        this.logger.info({
            requestId,
            method: req.method,
            path,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
            userId: req.user?.id,
        }, 'http_request');
    }
    shouldSkip(path) {
        const normalizedPath = path.split('?')[0];
        return this.skippedPaths.has(normalizedPath);
    }
};
exports.HttpLoggingInterceptor = HttpLoggingInterceptor;
exports.HttpLoggingInterceptor = HttpLoggingInterceptor = HttpLoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger])
], HttpLoggingInterceptor);
//# sourceMappingURL=http-logging.interceptor.js.map