-- Seed monthly quests (separate migration: PG requires enum value commit before use)
INSERT INTO "QuestTemplate" ("key", "period", "metric", "target", "reward_chest_tier", "title_ru", "description_ru", "sort_order", "active")
VALUES
  ('monthly_cards_40', 'MONTHLY', 'CARDS_COMPLETED', 40, 'EPIC', '40 карточек за месяц', NULL, 1, true),
  ('monthly_checkins_20', 'MONTHLY', 'DAILY_CHECKIN_DONE', 20, 'RARE', '20 чекинов за месяц', NULL, 2, true)
ON CONFLICT ("key") DO NOTHING;
