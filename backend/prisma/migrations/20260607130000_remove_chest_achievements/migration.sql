-- Достижения за сундуки сняты с продукта (first_chest, chests_10).

DELETE FROM "UserAchievement"
WHERE "template_id" IN (
  SELECT "id" FROM "AchievementTemplate" WHERE "key" IN ('first_chest', 'chests_10')
);

DELETE FROM "UserAchievementProgress" WHERE "metric" = 'CHESTS_OPENED_TOTAL';

DELETE FROM "AchievementTemplate" WHERE "key" IN ('first_chest', 'chests_10');

ALTER TYPE "AchievementMetric" RENAME TO "AchievementMetric_old";

CREATE TYPE "AchievementMetric" AS ENUM (
  'CARDS_COMPLETED_TOTAL',
  'CHECKIN_STREAK_MAX',
  'CHARACTER_LEVEL',
  'QUESTS_COMPLETED_TOTAL',
  'DUST_EARNED_TOTAL',
  'COSMETICS_OWNED_COUNT'
);

ALTER TABLE "AchievementTemplate"
  ALTER COLUMN "metric" TYPE "AchievementMetric"
  USING ("metric"::text::"AchievementMetric");

ALTER TABLE "UserAchievementProgress"
  ALTER COLUMN "metric" TYPE "AchievementMetric"
  USING ("metric"::text::"AchievementMetric");

DROP TYPE "AchievementMetric_old";
