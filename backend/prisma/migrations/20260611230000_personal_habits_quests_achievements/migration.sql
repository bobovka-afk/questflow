-- Solo / habits: weekly & monthly quests + achievement ladder

INSERT INTO "QuestTemplate" ("key", "period", "metric", "target", "reward_chest_tier", "title_ru", "description_ru", "sort_order", "active")
VALUES
  (
    'daily_habits_10',
    'DAILY',
    'HABIT_POSITIVE_LOGGED',
    10,
    'COMMON',
    'День на максимум',
    'Отметьте 10 положительных привычек за день (лимит XP)',
    23,
    true
  ),
  (
    'weekly_habits_25',
    'WEEKLY',
    'HABIT_POSITIVE_LOGGED',
    25,
    'RARE',
    '25 привычек за неделю',
    '25 положительных отметок привычек за игровую неделю',
    4,
    true
  ),
  (
    'weekly_personal_15',
    'WEEKLY',
    'PERSONAL_ACTIONS_COMPLETED',
    15,
    'RARE',
    '15 личных дел',
    '15 выполненных задач или ежедневок за неделю',
    5,
    true
  ),
  (
    'weekly_perfect_dailies_5',
    'WEEKLY',
    'PERSONAL_DAILIES_ALL_DONE',
    5,
    'RARE',
    '5 идеальных дней',
    '5 дней подряд закрыть все ежедневки',
    6,
    true
  ),
  (
    'monthly_habits_100',
    'MONTHLY',
    'HABIT_POSITIVE_LOGGED',
    100,
    'EPIC',
    '100 отметок привычек',
    '100 положительных отметок привычек за месяц',
    3,
    true
  ),
  (
    'monthly_personal_50',
    'MONTHLY',
    'PERSONAL_ACTIONS_COMPLETED',
    50,
    'EPIC',
    '50 личных дел',
    '50 выполненных задач или ежедневок за месяц',
    4,
    true
  )
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "AchievementTemplate" ("key", "metric", "target", "title_ru", "description_ru", "reward_dust", "sort_order", "active")
VALUES
  (
    'habits_10',
    'HABIT_POSITIVE_LOGGED_TOTAL',
    10,
    'На автомате',
    '10 положительных отметок привычек',
    15,
    35,
    true
  ),
  (
    'habits_200',
    'HABIT_POSITIVE_LOGGED_TOTAL',
    200,
    'Железная дисциплина',
    '200 положительных отметок привычек',
    60,
    36,
    true
  ),
  (
    'habits_500',
    'HABIT_POSITIVE_LOGGED_TOTAL',
    500,
    'Мастер привычек',
    '500 положительных отметок привычек',
    120,
    37,
    true
  ),
  (
    'habit_streak_7',
    'HABIT_STREAK_BEST_MAX',
    7,
    'Неделя силы',
    'Лучшая серия привычки: 7 дней подряд',
    25,
    38,
    true
  ),
  (
    'habit_streak_66',
    'HABIT_STREAK_BEST_MAX',
    66,
    '66 дней',
    'Лучшая серия привычки: 66 дней подряд',
    150,
    39,
    true
  ),
  (
    'personal_todos_10',
    'PERSONAL_TODOS_COMPLETED_TOTAL',
    10,
    'Список закрыт',
    'Выполнить 10 личных задач',
    20,
    40,
    true
  ),
  (
    'personal_todos_50',
    'PERSONAL_TODOS_COMPLETED_TOTAL',
    50,
    'Дела сделаны',
    'Выполнить 50 личных задач',
    50,
    41,
    true
  ),
  (
    'perfect_dailies_30',
    'PERSONAL_DAILIES_ALL_DONE_TOTAL',
    30,
    'Месяц без дыр',
    '30 дней закрыть все ежедневки',
    120,
    42,
    true
  )
ON CONFLICT ("key") DO NOTHING;
