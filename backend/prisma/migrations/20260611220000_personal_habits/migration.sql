-- AlterEnum XpEventType
ALTER TYPE "XpEventType" ADD VALUE IF NOT EXISTS 'PERSONAL_TODO_COMPLETED';
ALTER TYPE "XpEventType" ADD VALUE IF NOT EXISTS 'PERSONAL_DAILY_COMPLETED';
ALTER TYPE "XpEventType" ADD VALUE IF NOT EXISTS 'HABIT_POSITIVE';

-- AlterEnum HealthEventReason
ALTER TYPE "HealthEventReason" ADD VALUE IF NOT EXISTS 'HABIT_NEGATIVE';
ALTER TYPE "HealthEventReason" ADD VALUE IF NOT EXISTS 'MISSED_DAILY';

-- AlterEnum QuestMetric
ALTER TYPE "QuestMetric" ADD VALUE IF NOT EXISTS 'PERSONAL_ACTIONS_COMPLETED';
ALTER TYPE "QuestMetric" ADD VALUE IF NOT EXISTS 'HABIT_POSITIVE_LOGGED';
ALTER TYPE "QuestMetric" ADD VALUE IF NOT EXISTS 'PERSONAL_DAILIES_ALL_DONE';

-- AlterEnum AchievementMetric
ALTER TYPE "AchievementMetric" ADD VALUE IF NOT EXISTS 'PERSONAL_TODOS_COMPLETED_TOTAL';
ALTER TYPE "AchievementMetric" ADD VALUE IF NOT EXISTS 'HABIT_POSITIVE_LOGGED_TOTAL';
ALTER TYPE "AchievementMetric" ADD VALUE IF NOT EXISTS 'HABIT_STREAK_BEST_MAX';
ALTER TYPE "AchievementMetric" ADD VALUE IF NOT EXISTS 'PERSONAL_DAILIES_ALL_DONE_TOTAL';

-- CreateEnum
CREATE TYPE "HabitPolarity" AS ENUM ('POSITIVE', 'NEGATIVE', 'BOTH');
CREATE TYPE "DailySchedule" AS ENUM ('EVERY_DAY');

-- AlterTable XpEvent
ALTER TABLE "XpEvent" ADD COLUMN IF NOT EXISTS "personal_todo_id" INTEGER;
ALTER TABLE "XpEvent" ADD COLUMN IF NOT EXISTS "personal_daily_id" INTEGER;
ALTER TABLE "XpEvent" ADD COLUMN IF NOT EXISTS "personal_habit_id" INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS "XpEvent_user_id_type_personal_todo_id_key"
  ON "XpEvent"("user_id", "type", "personal_todo_id");
CREATE UNIQUE INDEX IF NOT EXISTS "XpEvent_user_id_type_personal_daily_id_day_key_key"
  ON "XpEvent"("user_id", "type", "personal_daily_id", "day_key");
CREATE UNIQUE INDEX IF NOT EXISTS "XpEvent_user_id_type_personal_habit_id_day_key_key"
  ON "XpEvent"("user_id", "type", "personal_habit_id", "day_key");

-- CreateTable PersonalHabit
CREATE TABLE "PersonalHabit" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "polarity" "HabitPolarity" NOT NULL DEFAULT 'BOTH',
    "emoji" TEXT,
    "color" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "streak_current" INTEGER NOT NULL DEFAULT 0,
    "streak_best" INTEGER NOT NULL DEFAULT 0,
    "positive_count" INTEGER NOT NULL DEFAULT 0,
    "negative_count" INTEGER NOT NULL DEFAULT 0,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonalHabit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PersonalHabit_user_id_archived_at_idx" ON "PersonalHabit"("user_id", "archived_at");

ALTER TABLE "PersonalHabit" ADD CONSTRAINT "PersonalHabit_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable PersonalDaily
CREATE TABLE "PersonalDaily" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "schedule" "DailySchedule" NOT NULL DEFAULT 'EVERY_DAY',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "streak_current" INTEGER NOT NULL DEFAULT 0,
    "streak_best" INTEGER NOT NULL DEFAULT 0,
    "last_completed_day_key" DATE,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonalDaily_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PersonalDaily_user_id_archived_at_idx" ON "PersonalDaily"("user_id", "archived_at");

ALTER TABLE "PersonalDaily" ADD CONSTRAINT "PersonalDaily_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable PersonalTodo
CREATE TABLE "PersonalTodo" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "due_at" TIMESTAMP(3),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonalTodo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PersonalTodo_user_id_is_completed_archived_at_idx"
  ON "PersonalTodo"("user_id", "is_completed", "archived_at");

ALTER TABLE "PersonalTodo" ADD CONSTRAINT "PersonalTodo_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable PersonalDailyMissLog
CREATE TABLE "PersonalDailyMissLog" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "personal_daily_id" INTEGER NOT NULL,
    "day_key" DATE NOT NULL,
    "hp_delta" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonalDailyMissLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PersonalDailyMissLog_user_id_personal_daily_id_day_key_key"
  ON "PersonalDailyMissLog"("user_id", "personal_daily_id", "day_key");
CREATE INDEX "PersonalDailyMissLog_user_id_day_key_idx"
  ON "PersonalDailyMissLog"("user_id", "day_key");

ALTER TABLE "PersonalDailyMissLog" ADD CONSTRAINT "PersonalDailyMissLog_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalDailyMissLog" ADD CONSTRAINT "PersonalDailyMissLog_personal_daily_id_fkey"
  FOREIGN KEY ("personal_daily_id") REFERENCES "PersonalDaily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_personal_todo_id_fkey"
  FOREIGN KEY ("personal_todo_id") REFERENCES "PersonalTodo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_personal_daily_id_fkey"
  FOREIGN KEY ("personal_daily_id") REFERENCES "PersonalDaily"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_personal_habit_id_fkey"
  FOREIGN KEY ("personal_habit_id") REFERENCES "PersonalHabit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Quest templates
INSERT INTO "QuestTemplate" ("key", "period", "metric", "target", "reward_chest_tier", "title_ru", "description_ru", "sort_order", "active")
VALUES
  ('daily_personal_3', 'DAILY', 'PERSONAL_ACTIONS_COMPLETED', 3, 'COMMON', 'Три личных дела', 'Выполните 3 личные задачи или ежедневки за день', 20, true),
  ('daily_habits_5', 'DAILY', 'HABIT_POSITIVE_LOGGED', 5, 'COMMON', '5 полезных привычек', 'Отметьте 5 положительных привычек за день', 21, true),
  ('daily_all_dailies', 'DAILY', 'PERSONAL_DAILIES_ALL_DONE', 1, 'COMMON', 'Все ежедневки', 'Выполните все активные ежедневки за день', 22, true)
ON CONFLICT ("key") DO NOTHING;

-- Achievements
INSERT INTO "AchievementTemplate" ("key", "metric", "target", "title_ru", "description_ru", "reward_dust", "sort_order", "active")
VALUES
  ('first_personal_task', 'PERSONAL_TODOS_COMPLETED_TOTAL', 1, 'Первый шаг', 'Выполните первую личную задачу', 10, 30, true),
  ('habits_50', 'HABIT_POSITIVE_LOGGED_TOTAL', 50, 'Привычка к привычкам', '50 положительных отметок привычек', 50, 31, true),
  ('habit_streak_21', 'HABIT_STREAK_BEST_MAX', 21, '21 день', 'Лучшая серия привычки: 21 день', 75, 32, true),
  ('perfect_dailies_7', 'PERSONAL_DAILIES_ALL_DONE_TOTAL', 7, 'Неделя без пропусков', '7 дней подряд — все ежедневки выполнены', 100, 33, true)
ON CONFLICT ("key") DO NOTHING;
