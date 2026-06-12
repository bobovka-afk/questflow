# Questflow — геймификация: продуктовый план

План фаз, баланс, **каталог квестов и достижений**, разделы приложения. Для агента: инварианты и карта файлов — [gamification-agent-context.md](gamification-agent-context.md). Solo-привычки — [solo-habits-roadmap.md](solo-habits-roadmap.md).

---

## Разделы приложения (маршруты)

| Раздел | Маршрут | Назначение | Геймификация |
|--------|---------|------------|--------------|
| **Главная / вход** | `/` | Регистрация, логин, OAuth | Intro-модалка после регистрации |
| **Привычки** (solo) | `/personal` | Три колонки: привычки, ежедневные, задачи | XP/HP, квесты, achievements, мана |
| **Воркспейсы** | `/workspaces` | Список WS, quick actions, **DnD порядка** | — |
| **Доски WS** | `/workspaces/:id/boards` | Список досок | — |
| **Доска** | `/workspaces/:id/boards/:boardId` | Kanban: колонки + карточки, DnD | XP за закрытие карточки, мана |
| **Участники** | `/workspaces/:id/members` | Роли, приглашения | — |
| **Активность** | `/workspaces/:id/activity` | Журнал WS | — |
| **Персонаж** | `/profile/character` | XP, HP, квесты, сундуки, косметика | Центр RPG |
| **Чужой персонаж** | `/profile/:userId/character` | Read-only | — |
| **Создание персонажа** | `/character-setup` | Первый вход; без WS → `/personal` | — |
| **Настройки** | `/settings` | Аккаунт, сессии, privacy | [profile-settings-roadmap.md](profile-settings-roadmap.md) |
| **Сообщения** | `/messages` | DM 1:1, друзья | — |
| **Уведомления** | `/notifications` | In-app | — |
| **Приглашения** | `/invites` | Входящие invite WS | — |

**Rail (`AppIconRail`):** Доски → **Привычки** (`/personal`) → Персонаж → Сообщения → …

---

## Статус фаз

| Phase | Состояние | Содержание |
|-------|-----------|------------|
| **0** | Done | Персонаж, XP за карточку, уровни, HP+5 |
| **0.5** | Done | Cron сброс `dailyActivityXpEarned`, `rewards.ts` |
| **1** | Done | Чекин, streak, неактивность, HP bar |
| **2** | Done | Квесты + сундуки (1 сундук за квест) |
| **3** | Done | Пыль, achievements, магазин сундуков |
| **4** | In progress | Гайд «Как это работает»; E2E — backlog |
| **4.social** | Done (MVP) | Друзья, DM, коллеги из общего WS |
| **5.party** | In progress | Рейд-боссы 2–8, мана, урон в % HP |
| **6.personal** | Done (v1) | `/personal`, habits/dailies/todos, квесты solo |
| **6.ws-order** | Done | `WorkspaceMember.sortOrder`, DnD на `/workspaces` |

---

## Экономика (v1)

| Параметр | Значение | Примечание |
|----------|----------|------------|
| XP за карточку / личную задачу / ежедневную задачу | 100 | Общий лимит **500 XP** активности / игровые сутки (с привычками) |
| XP за привычку «+» | 25 | Входит в лимит 500; макс. **1 XP-событие / привычку / сутки** |
| HP за «−» привычку | −5 | Макс. **1 штраф / привычку / сутки** (`PersonalHabitNegativeLog`); стрик → 0 |
| HP за пропуск ежедневной задачи (cron) | −5 | Cap **−15** HP / сутки за все пропуски |
| Чекин | 100 XP | Авто при первом XP за игровой день |
| Мана за task-like XP | +5 | Cap 100; нужна для ударов по боссу |
| Игровой день | `GAME_DAY_TZ` | Cron 00:00 |

Константы: `backend/src/gamification/config/rewards.ts` ↔ `frontend/src/lib/xpRewards.ts`.

---

## Квесты — полный каталог (активные шаблоны)

Награда: сундук tier из колонки «Сундук». Прогресс сбрасывается по периоду (день / неделя / месяц в `GAME_DAY_TZ`).

### Дневные (DAILY)

| key | Метрика | Цель | Сундук | Название |
|-----|---------|------|--------|----------|
| `daily_cards_3` | `CARDS_COMPLETED` | 3 | COMMON | Выполнить 3 карточки |
| `daily_personal_3` | `PERSONAL_ACTIONS_COMPLETED` | 3 | COMMON | Выполнить 3 личных дела |
| `daily_habits_5` | `HABIT_POSITIVE_LOGGED` | 5 | COMMON | Отметить 5 привычек |
| `daily_habits_10` | `HABIT_POSITIVE_LOGGED` | 10 | COMMON | Отметить 10 привычек |

`PERSONAL_ACTIONS_COMPLETED` = выполненная личная **задача** или **ежедневная задача** (не привычка).

### Недельные (WEEKLY)

| key | Метрика | Цель | Сундук | Название |
|-----|---------|------|--------|----------|
| `weekly_cards_15` | `CARDS_COMPLETED` | 15 | RARE | Выполнить 15 карточек |
| `weekly_active_days` | `ACTIVE_DAYS_WITH_XP` | 5 | RARE | 5 активных дней |
| `weekly_personal_15` | `PERSONAL_ACTIONS_COMPLETED` | 15 | RARE | Выполнить 15 личных дел |
| `weekly_perfect_dailies_5` | `PERSONAL_DAILIES_ALL_DONE` | 5 | RARE | 5 идеальных дней |

`PERSONAL_DAILIES_ALL_DONE` = все активные ежедневные задачи закрыты за игровой день.

### Месячные (MONTHLY)

| key | Метрика | Цель | Сундук | Название |
|-----|---------|------|--------|----------|
| `monthly_cards_40` | `CARDS_COMPLETED` | **100** | EPIC | Выполнить 100 карточек |
| `monthly_checkins_20` | `DAILY_CHECKIN_DONE` | 20 | RARE | 20 активных дней |
| `monthly_habits_100` | `HABIT_POSITIVE_LOGGED` | 100 | EPIC | Отметить 100 привычек |
| `monthly_personal_50` | `PERSONAL_ACTIONS_COMPLETED` | 50 | EPIC | Выполнить 50 личных дел |

### Отключённые / удалённые

| key | Статус |
|-----|--------|
| `daily_due_today`, `daily_comment`, `daily_checkin`, `weekly_two_ws` | Удалены (миграция `20260611200000`) |
| `weekly_habits_25` | Удалён (миграция `20260612190000`) |
| `daily_all_dailies` | `active = false` |
| `daily_habits_5` | Активен (не путать с удалёнными) |

---

## Достижения — полный каталог (активные)

Разовые вехи; награда — пыль (`reward_dust`), кроме `dust_100` (0).

### Карточки и социал (команда)

| key | Метрика | Цель | Название |
|-----|---------|------|----------|
| `first_card` | `CARDS_COMPLETED_TOTAL` | 1 | Первая победа |
| `cards_25` | `CARDS_COMPLETED_TOTAL` | 25 | Трудяга |
| `cards_100` | `CARDS_COMPLETED_TOTAL` | 100 | Машина закрытий |
| `first_comment` | `COMMENTS_TOTAL` | 1 | Голос команды |
| `comments_20` | `COMMENTS_TOTAL` | 20 | Обсуждатель |

### Серия, уровень, квесты, сундуки, косметика

| key | Метрика | Цель | Название |
|-----|---------|------|----------|
| `streak_7` | `CHECKIN_STREAK_MAX` | 7 | Неделя в строю |
| `streak_30` | `CHECKIN_STREAK_MAX` | 30 | Легенда серии |
| `level_5` | `CHARACTER_LEVEL` | 5 | Опытный герой |
| `level_10` | `CHARACTER_LEVEL` | 10 | Ветеран |
| `first_quest` | `QUESTS_COMPLETED_TOTAL` | 1 | Искатель |
| `quests_20` | `QUESTS_COMPLETED_TOTAL` | 20 | Мастер квестов |
| `first_chest` | `CHESTS_OPENED_TOTAL` | 1 | Вскрыватель |
| `chests_10` | `CHESTS_OPENED_TOTAL` | 10 | Кладоискатель |
| `dust_100` | `DUST_EARNED_TOTAL` | 100 | Собиратель пыли |
| `cosmetics_5` | `COSMETICS_OWNED_COUNT` | 5 | Коллекционер |

### Solo / привычки (Phase 6)

| key | Метрика | Цель | Название |
|-----|---------|------|----------|
| `habits_10` | `HABIT_POSITIVE_LOGGED_TOTAL` | 10 | На автомате |
| `habits_50` | `HABIT_POSITIVE_LOGGED_TOTAL` | 50 | Привычка к привычкам |
| `habits_200` | `HABIT_POSITIVE_LOGGED_TOTAL` | 200 | Железная дисциплина |
| `habits_500` | `HABIT_POSITIVE_LOGGED_TOTAL` | 500 | Мастер привычек |
| `habit_streak_7` | `HABIT_STREAK_BEST_MAX` | 7 | Неделя силы |
| `habit_streak_21` | `HABIT_STREAK_BEST_MAX` | 21 | 21 день |
| `habit_streak_66` | `HABIT_STREAK_BEST_MAX` | 66 | 66 дней |
| `personal_todos_10` | `PERSONAL_TODOS_COMPLETED_TOTAL` | 10 | Список закрыт |
| `personal_todos_50` | `PERSONAL_TODOS_COMPLETED_TOTAL` | 50 | Дела сделаны |
| `perfect_dailies_7` | `PERSONAL_DAILIES_ALL_DONE_TOTAL` | 7 | Неделя без пропусков |
| `perfect_dailies_30` | `PERSONAL_DAILIES_ALL_DONE_TOTAL` | 30 | Месяц без дыр |

### Отключённые achievements

| key | Статус |
|-----|--------|
| `first_personal_task`, `first_habit_plus` | `active = false` |

---

## Phase 4 — E2E и гайд по игре (финал v1)

- [x] `GamificationGuide` на профиле (базовый)
- [ ] Раздел гайда «Привычки / личное»
- [ ] E2E: карточка → XP; personal todo → квест
- [ ] Backlog: push-уведомления, battle pass, лидерборд

---

## Known gaps (история; Phase 1 закрыта)

| Тема | Статус |
|------|--------|
| `dailyActivityXpEarned` сброс по cron | Done |
| Solo без воркспейса | Done — `/personal` |
| Квесты только на карточки | Расширено Phase 6 |
| DnD reorder в `/personal` | Backlog |
| GamificationGuide — личное | Backlog |
| Unit-тесты `personal-reward.service` | Backlog |

---

## Воркспейсы: порядок списка (не геймификация)

- Поле `WorkspaceMember.sortOrder` — персональный порядок для пользователя.
- API: `PATCH /workspace/reorder-user-workspace` `{ memberId, position }`.
- UI: drag-and-drop на `/workspaces` (ручка ⋮⋮), `@hello-pangea/dnd`.

---

*Обновлять при новых квестах, фазах, константах или разделах приложения. Синхронно с [gamification-agent-context.md](gamification-agent-context.md).*
