-- Unified daily activity XP cap: store earned XP (not event count)
ALTER TABLE "Character" RENAME COLUMN "daily_task_xp_count" TO "daily_activity_xp_earned";

-- Old column stored completion counts; reset for XP-based semantics
UPDATE "Character" SET "daily_activity_xp_earned" = 0;
