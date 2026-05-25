"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streakMilestoneDayKey = streakMilestoneDayKey;
exports.isStreakMilestoneDayKey = isStreakMilestoneDayKey;
exports.milestoneDaysFromDayKey = milestoneDaysFromDayKey;
exports.getNewlyReachedStreakMilestones = getNewlyReachedStreakMilestones;
const checkin_streak_milestones_1 = require("./config/checkin-streak-milestones");
const MILESTONE_DAY_KEY_EPOCH_MS = Date.UTC(2000, 0, 1);
function streakMilestoneDayKey(milestoneDays) {
    return new Date(MILESTONE_DAY_KEY_EPOCH_MS + milestoneDays * 86_400_000);
}
function isStreakMilestoneDayKey(dayKey) {
    return milestoneDaysFromDayKey(dayKey) != null;
}
function milestoneDaysFromDayKey(dayKey) {
    const diffMs = dayKey.getTime() - MILESTONE_DAY_KEY_EPOCH_MS;
    if (diffMs <= 0 || diffMs % 86_400_000 !== 0) {
        return null;
    }
    const days = diffMs / 86_400_000;
    return checkin_streak_milestones_1.CHECKIN_STREAK_MILESTONES.some((m) => m.days === days) ? days : null;
}
function getNewlyReachedStreakMilestones(previousStreak, newStreak) {
    return checkin_streak_milestones_1.CHECKIN_STREAK_MILESTONES.filter((m) => newStreak >= m.days && previousStreak < m.days);
}
//# sourceMappingURL=checkin-streak-milestones.js.map