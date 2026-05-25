ALTER TABLE "Character" ADD COLUMN "checkin_streak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Character" ADD COLUMN "last_checkin_day_key" DATE;
