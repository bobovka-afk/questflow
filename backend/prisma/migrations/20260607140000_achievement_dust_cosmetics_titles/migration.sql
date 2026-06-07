-- dust_100: переименование; cosmetics_5 → cosmetics_10 (порог 10).

UPDATE "AchievementTemplate"
SET "title_ru" = 'Коллекционер пыли'
WHERE "key" = 'dust_100';

UPDATE "AchievementTemplate"
SET
  "key" = 'cosmetics_10',
  "target" = 10,
  "description_ru" = 'Иметь 10 предметов косметики'
WHERE "key" = 'cosmetics_5';
