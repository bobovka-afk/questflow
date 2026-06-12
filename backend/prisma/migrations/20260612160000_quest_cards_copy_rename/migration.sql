-- Card-completion quest labels (UI uses description_ru, fallback title_ru)
UPDATE "QuestTemplate"
SET
  "title_ru" = 'Выполнить 3 карточки',
  "description_ru" = 'Выполнить 3 карточки'
WHERE "key" = 'daily_cards_3';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Выполнить 15 карточек',
  "description_ru" = 'Выполнить 15 карточек'
WHERE "key" = 'weekly_cards_15';

UPDATE "QuestTemplate"
SET
  "title_ru" = 'Выполнить 100 карточек',
  "description_ru" = 'Выполнить 100 карточек'
WHERE "key" = 'monthly_cards_40';
