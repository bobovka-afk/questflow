import type { GamificationErrorCode } from './gamification-error-code';
export interface GamificationApiErrorBody {
    code: GamificationErrorCode;
    message: string;
}
