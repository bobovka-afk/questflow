-- UI copy: «ежедневка» → «ежедневная задача» в квестах и достижениях

UPDATE "QuestTemplate"
SET "description_ru" = 'Выполните 3 личные или ежедневные задачи за день'
WHERE "key" = 'daily_personal_3';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Все ежедневные задачи',
  "description_ru" = 'Выполните все активные ежедневные задачи за день'
WHERE "key" = 'daily_all_dailies';

UPDATE "QuestTemplate"
SET "description_ru" = '15 выполненных личных или ежедневных задач за неделю'
WHERE "key" = 'weekly_personal_15';

UPDATE "QuestTemplate"
SET "description_ru" = '5 дней подряд закрыть все ежедневные задачи'
WHERE "key" = 'weekly_perfect_dailies_5';

UPDATE "QuestTemplate"
SET "description_ru" = '50 выполненных личных или ежедневных задач за месяц'
WHERE "key" = 'monthly_personal_50';

UPDATE "AchievementTemplate"
SET "description_ru" = '7 дней подряд — все ежедневные задачи выполнены'
WHERE "key" = 'perfect_dailies_7';

UPDATE "AchievementTemplate"
SET "description_ru" = '30 дней закрыть все ежедневные задачи'
WHERE "key" = 'perfect_dailies_30';
