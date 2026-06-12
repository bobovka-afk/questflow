-- Standalone quest copy for UI (title hidden; description is the only label)
UPDATE "QuestTemplate"
SET "description_ru" = '15 карточек за неделю'
WHERE "key" = 'weekly_cards_15'
  AND ("description_ru" IS NULL OR TRIM("description_ru") = '');

UPDATE "QuestTemplate"
SET "description_ru" = '100 карточек за месяц'
WHERE "key" = 'monthly_cards_40'
  AND ("description_ru" IS NULL OR TRIM("description_ru") = '');

UPDATE "QuestTemplate"
SET "description_ru" = '20 чекинов за месяц'
WHERE "key" = 'monthly_checkins_20'
  AND ("description_ru" IS NULL OR TRIM("description_ru") = '');
