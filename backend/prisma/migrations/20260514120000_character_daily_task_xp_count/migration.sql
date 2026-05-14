-- Align Character with schema: daily XP cap counter for task rewards
ALTER TABLE "Character" ADD COLUMN "daily_task_xp_count" INTEGER NOT NULL DEFAULT 0;
