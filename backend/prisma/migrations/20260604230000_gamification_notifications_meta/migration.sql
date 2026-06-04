-- Extend in-app notification types (gamification + social)
ALTER TYPE "UserNotificationType" ADD VALUE IF NOT EXISTS 'XP_GAIN';
ALTER TYPE "UserNotificationType" ADD VALUE IF NOT EXISTS 'QUEST_COMPLETED';
ALTER TYPE "UserNotificationType" ADD VALUE IF NOT EXISTS 'CHEST_READY';
ALTER TYPE "UserNotificationType" ADD VALUE IF NOT EXISTS 'ACHIEVEMENT';
ALTER TYPE "UserNotificationType" ADD VALUE IF NOT EXISTS 'PARTY_RAID_INVITE';
ALTER TYPE "UserNotificationType" ADD VALUE IF NOT EXISTS 'FRIEND_REQUEST';
ALTER TYPE "UserNotificationType" ADD VALUE IF NOT EXISTS 'CARD_ASSIGNED';

-- Monthly quest period
ALTER TYPE "QuestPeriod" ADD VALUE IF NOT EXISTS 'MONTHLY';

ALTER TYPE "UserSecurityEventType" ADD VALUE IF NOT EXISTS 'ACCOUNT_DELETED';

INSERT INTO "QuestTemplate" ("key", "period", "metric", "target", "reward_chest_tier", "title_ru", "description_ru", "sort_order", "active")
VALUES
  ('monthly_cards_40', 'MONTHLY', 'CARDS_COMPLETED', 40, 'EPIC', '40 карточек за месяц', NULL, 1, true),
  ('monthly_checkins_20', 'MONTHLY', 'DAILY_CHECKIN_DONE', 20, 'RARE', '20 чекинов за месяц', NULL, 2, true)
ON CONFLICT ("key") DO NOTHING;
