export const XP_PER_TASK_COMPLETED = 100;

export const XP_DAILY_CHECKIN = 100;

export const XP_PER_PERSONAL_TODO = 100;

export const XP_PER_PERSONAL_DAILY = 100;

export const XP_PER_HABIT_POSITIVE = 25;

/** Max XP from boards + personal + habits per game day (check-in is separate). */
export const DAILY_ACTIVITY_XP_MAX = 500;

export const HP_GAIN_PER_XP_EVENT = 5;

export const HP_INACTIVITY_PENALTY = 5;

export const HP_MISSED_DAILY_PENALTY = 5;

export const HP_MISSED_DAILIES_DAILY_CAP = 15;

export const HP_HABIT_NEGATIVE_PENALTY = 5;

export const CHARACTER_HEALTH_MAX = 100;

export const CHARACTER_GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

export const MANA_MAX = 100;

export const MANA_PER_TASK_COMPLETED = 5;

export const BOSS_ATTACK_MANA_COST = 5;

export const BOSS_DAILY_PARTY_BUDGET_PCT = 40;

export const BOSS_MAX_ATTACKS_PER_DAY =
  DAILY_ACTIVITY_XP_MAX / XP_PER_TASK_COMPLETED;

export const BOSS_MIN_PARTY_SIZE = 2;

export const BOSS_MAX_PARTY_SIZE = 8;

export const BOSS_RAID_TTL_DAYS = 5;

export const BOSS_MIN_CONTRIBUTION_PCT_FOR_LOOT = 5;

export const MAX_ACTIVE_RAIDS_PER_USER = 2;

/** Members without a boss hit for this many ms are auto-kicked from active raids. */
export const PARTY_AFK_INACTIVE_MS = 2 * 24 * 60 * 60 * 1000;
