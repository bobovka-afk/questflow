DELETE FROM "QuestTemplate"
WHERE "key" IN (
  'daily_due_today',
  'daily_comment',
  'daily_checkin',
  'weekly_two_ws'
);
