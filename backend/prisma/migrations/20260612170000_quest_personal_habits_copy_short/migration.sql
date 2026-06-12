-- Shorter quest labels (UI uses description_ru, fallback title_ru)

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Выполнить 3 личных дела',
  "description_ru" = 'Выполнить 3 личных дела'
WHERE "key" = 'daily_personal_3';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Отметить 5 привычек',
  "description_ru" = 'Отметить 5 привычек'
WHERE "key" = 'daily_habits_5';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Отметить 10 привычек',
  "description_ru" = 'Отметить 10 привычек'
WHERE "key" = 'daily_habits_10';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Отметить 25 привычек',
  "description_ru" = 'Отметить 25 привычек'
WHERE "key" = 'weekly_habits_25';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Выполнить 15 личных дел',
  "description_ru" = 'Выполнить 15 личных дел'
WHERE "key" = 'weekly_personal_15';

UPDATE "QuestTemplate"
SET
  "title_ru" = '5 идеальных дней',
  "description_ru" = '5 идеальных дней'
WHERE "key" = 'weekly_perfect_dailies_5';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Отметить 100 привычек',
  "description_ru" = 'Отметить 100 привычек'
WHERE "key" = 'monthly_habits_100';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Выполнить 50 личных дел',
  "description_ru" = 'Выполнить 50 личных дел'
WHERE "key" = 'monthly_personal_50';
