import { HealthService } from './health.service';
import type { HealthLiveness, HealthReadiness } from './interface';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    health(): HealthLiveness;
    ready(): Promise<HealthReadiness>;
}
