-- Active-day quest labels (UI uses description_ru, fallback title_ru)

UPDATE "QuestTemplate"
SET
  "title_ru" = '5 активных дней',
  "description_ru" = '5 активных дней'
WHERE "key" = 'weekly_active_days';

UPDATE "QuestTemplate"
SET
  "title_ru" = '20 активных дней',
  "description_ru" = '20 активных дней'
WHERE "key" = 'monthly_checkins_20';
