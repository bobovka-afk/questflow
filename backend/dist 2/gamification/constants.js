"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XP_EVENT_TYPES_REQUIRING_DAY_KEY = exports.DEFAULT_GAME_DAY_TZ = void 0;
const enums_1 = require("../generated/prisma/enums");
exports.DEFAULT_GAME_DAY_TZ = 'UTC';
exports.XP_EVENT_TYPES_REQUIRING_DAY_KEY = [
    enums_1.XpEventType.DAILY_CHECKIN,
    enums_1.XpEventType.CHECKIN_STREAK,
];
//# sourceMappingURL=constants.js.map