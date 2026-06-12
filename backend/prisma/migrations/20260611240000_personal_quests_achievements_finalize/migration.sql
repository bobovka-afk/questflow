-- Deactivate personal/habit templates removed from product scope
UPDATE "QuestTemplate"
SET active = false
WHERE "key" = 'daily_all_dailies';

UPDATE "AchievementTemplate"
SET active = false
WHERE "key" IN ('first_personal_task', 'first_habit_plus');
