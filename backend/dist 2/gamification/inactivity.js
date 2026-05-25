"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wasUserActiveOnGameDay = wasUserActiveOnGameDay;
const game_day_1 = require("./game-day");
async function wasUserActiveOnGameDay(prisma, userId, dayKey, timeZone) {
    const { start, end } = (0, game_day_1.getGameDayBounds)(dayKey, timeZone);
    const event = await prisma.xpEvent.findFirst({
        where: {
            userId,
            createdAt: { gte: start, lt: end },
        },
        select: { id: true },
    });
    return event !== null;
}
//# sourceMappingURL=inactivity.js.map