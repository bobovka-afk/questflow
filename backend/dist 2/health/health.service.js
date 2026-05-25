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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const prisma_service_1 = require("../prisma/prisma.service");
let HealthService = class HealthService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptimeSeconds: Math.round(process.uptime()),
        };
    }
    async getReadiness() {
        const postgres = await this.checkPostgres();
        const redis = await this.checkRedis();
        const ready = postgres.ok && redis.ok;
        return {
            status: ready ? 'ready' : 'not_ready',
            checks: {
                postgres,
                redis,
            },
            timestamp: new Date().toISOString(),
        };
    }
    async checkPostgres() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return { ok: true };
        }
        catch (error) {
            return {
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown PostgreSQL error',
            };
        }
    }
    async checkRedis() {
        const host = this.configService.get('REDIS_HOST') ?? 'localhost';
        const port = Number(this.configService.get('REDIS_PORT') ?? 6379);
        const redis = new ioredis_1.default({
            host,
            port,
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false,
        });
        try {
            await redis.connect();
            const result = await redis.ping();
            return { ok: result === 'PONG' };
        }
        catch (error) {
            return {
                ok: false,
                error: error instanceof Error ? error.message : 'Unknown Redis error',
            };
        }
        finally {
            redis.disconnect();
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], HealthService);
//# sourceMappingURL=health.service.js.map