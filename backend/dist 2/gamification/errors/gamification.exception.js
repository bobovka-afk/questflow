"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwXpEventDayKeyRequired = throwXpEventDayKeyRequired;
exports.throwDailyTaskXpLimit = throwDailyTaskXpLimit;
exports.throwXpEventDuplicate = throwXpEventDuplicate;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../generated/prisma/enums");
const gamification_error_code_1 = require("./gamification-error-code");
const GAMIFICATION_ERROR_MESSAGE = {
    XP_EVENT_DAY_KEY_REQUIRED: 'dayKey is required for this experience event type',
    CHECKIN_ALREADY_DONE: 'Daily check-in was already completed for today',
    XP_EVENT_ALREADY_RECORDED: 'Experience for this action was already granted',
    DAILY_TASK_XP_LIMIT: 'Daily limit of task experience rewards reached',
};
function gamificationBadRequest(code) {
    const body = {
        code: gamification_error_code_1.GAMIFICATION_ERROR_CODE[code],
        message: GAMIFICATION_ERROR_MESSAGE[code],
    };
    throw new common_1.BadRequestException(body);
}
function gamificationConflict(code) {
    const body = {
        code: gamification_error_code_1.GAMIFICATION_ERROR_CODE[code],
        message: GAMIFICATION_ERROR_MESSAGE[code],
    };
    throw new common_1.ConflictException(body);
}
function throwXpEventDayKeyRequired() {
    gamificationBadRequest('XP_EVENT_DAY_KEY_REQUIRED');
}
function throwDailyTaskXpLimit() {
    gamificationConflict('DAILY_TASK_XP_LIMIT');
}
function throwXpEventDuplicate(eventType) {
    if (eventType === enums_1.XpEventType.DAILY_CHECKIN) {
        gamificationConflict('CHECKIN_ALREADY_DONE');
    }
    gamificationConflict('XP_EVENT_ALREADY_RECORDED');
}
//# sourceMappingURL=gamification.exception.js.map