"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameDayKey = getGameDayKey;
exports.getTodayGameDayKey = getTodayGameDayKey;
exports.getYesterdayGameDayKey = getYesterdayGameDayKey;
exports.getGameDayBounds = getGameDayBounds;
const constants_1 = require("./constants");
function getGameDayKey(instant, timeZone = constants_1.DEFAULT_GAME_DAY_TZ) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(instant);
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    if (!year || !month || !day) {
        throw new Error(`Failed to resolve game day in timezone ${timeZone}`);
    }
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}
function getTodayGameDayKey(timeZone = constants_1.DEFAULT_GAME_DAY_TZ) {
    return getGameDayKey(new Date(), timeZone);
}
function getYesterdayGameDayKey(timeZone = constants_1.DEFAULT_GAME_DAY_TZ) {
    const today = getTodayGameDayKey(timeZone);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return yesterday;
}
function getGameDayBounds(dayKey, timeZone = constants_1.DEFAULT_GAME_DAY_TZ) {
    const start = findGameDayStartInstant(dayKey, timeZone);
    const nextKey = new Date(dayKey);
    nextKey.setUTCDate(nextKey.getUTCDate() + 1);
    const end = findGameDayStartInstant(nextKey, timeZone);
    return { start, end };
}
function findGameDayStartInstant(dayKey, timeZone) {
    const target = dayKey.getTime();
    const y = dayKey.getUTCFullYear();
    const mo = dayKey.getUTCMonth();
    const d = dayKey.getUTCDate();
    let firstMatch = null;
    for (let hour = -28; hour <= 28; hour++) {
        const candidate = new Date(Date.UTC(y, mo, d, hour, 0, 0, 0));
        if (getGameDayKey(candidate, timeZone).getTime() === target) {
            firstMatch = candidate;
            break;
        }
    }
    if (!firstMatch) {
        throw new Error(`Could not find start of game day ${dayKey.toISOString()} in ${timeZone}`);
    }
    let start = firstMatch.getTime();
    let lo = start - 24 * 60 * 60 * 1000;
    let hi = start;
    while (hi - lo > 60_000) {
        const mid = Math.floor((lo + hi) / 2);
        if (getGameDayKey(new Date(mid), timeZone).getTime() === target) {
            hi = mid;
        }
        else {
            lo = mid;
        }
    }
    return new Date(hi);
}
//# sourceMappingURL=game-day.js.map