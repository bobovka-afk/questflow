"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameDayKeysEqual = gameDayKeysEqual;
exports.computeCheckinStreakAfterGrant = computeCheckinStreakAfterGrant;
const game_day_1 = require("./game-day");
function gameDayKeysEqual(a, b) {
    return a.getTime() === b.getTime();
}
function computeCheckinStreakAfterGrant(todayKey, lastCheckinDayKey, currentStreak, timeZone) {
    const previousCheckinStreak = currentStreak;
    if (lastCheckinDayKey && gameDayKeysEqual(lastCheckinDayKey, todayKey)) {
        return {
            checkinStreak: currentStreak,
            streakIncreased: false,
            previousCheckinStreak,
        };
    }
    const yesterdayKey = (0, game_day_1.getYesterdayGameDayKey)(timeZone);
    if (lastCheckinDayKey && gameDayKeysEqual(lastCheckinDayKey, yesterdayKey)) {
        return {
            checkinStreak: currentStreak + 1,
            streakIncreased: true,
            previousCheckinStreak,
        };
    }
    return {
        checkinStreak: 1,
        streakIncreased: true,
        previousCheckinStreak,
    };
}
//# sourceMappingURL=checkin-streak.js.map