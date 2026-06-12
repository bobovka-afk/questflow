# Questflow — Solo-режим: привычки и личные задачи (Habitica-style)

> **Статус:** **v1 реализовано** (март–июнь 2026) — `/personal`, три колонки (вариант 1), backend + геймификация + квесты/achievements solo. Backlog: DnD reorder колонок, GamificationGuide § личное, E2E, unit-тесты.  
> **Аудитория:** соло-пользователи без воркспейсов — основной сценарий входа в продукт.  
> **Референс:** [Habitica](https://habitica.com) — три колонки (Habits / Dailies / To-Dos), но адаптировано под экономику Questflow (XP, HP, квесты, сундуки, достижения).

**Связанные документы:**

- [gamification-agent-context.md](gamification-agent-context.md) — инварианты XP/HP, паттерны `addExperience`, квесты, achievements
- [gamification-roadmap.md](gamification-roadmap.md) — фазы, каталог квестов/achievements, разделы приложения
- [profile-settings-roadmap.md](profile-settings-roadmap.md) — аккаунт и `/settings` (не путать с личными задачами)
- [README.md](../README.md) — обзор приложения

> **Для AI-агента:** перед реализацией читай [gamification-agent-context.md](gamification-agent-context.md). После изменения констант, enum-ов, API — обновляй agent-context и этот файл.

---

## Проблема и цель

Сейчас геймификация Questflow завязана на **воркспейсы → доски → карточки**. Соло-пользователь без команды:

- не получает XP за «обычные» дела (спорт, чтение, уборка);
- видит пустой `/workspaces` и уходит;
- квесты типа `CARDS_COMPLETED` для него бессмысленны.

**Цель:** отдельный раздел **«Привычки»** (`/personal`) — полноценный solo-loop: задачи + привычки + награды, интегрированный в персонажа, квесты и достижения. Воркспейсы остаются опциональным слоем для команд (порядок WS — DnD на `/workspaces`, см. [gamification-roadmap.md](gamification-roadmap.md)).

---

## Ключевые продуктовые решения (зафиксировать до кода)

| # | Решение | Предложение v1 |
|---|---------|----------------|
| 1 | Один персонаж на user | Без изменений — solo и team делят одного персонажа |
| 2 | Маршрут раздела | `/personal` (+ вкладка rail **«Привычки»** между «Доски» и «Персонаж») |
| 3 | Три типа сущностей | **Привычки**, **Ежедневные**, **Задачи** (аналог Habitica Habits / Dailies / To-Dos) |
| 4 | Лимит XP активности в сутки | **Общий** пул `DAILY_ACTIVITY_XP_MAX` (**500 XP**) — карточки + личные задачи + ежедневные задачи + привычки; чекин (+100) отдельно |
| 5 | Пропуск ежедневной задачи | Штраф HP (−5), как при неактивности; не блокирует приложение |
| 6 | «Плохие» привычки | Кнопка «−» → `HP −5` (max 1/сутки/привычку), стрик → 0; полярность при создании: POSITIVE / NEGATIVE / BOTH |
| 6b | Стрик «+» | Растёт при каждом «+»; XP за «+» — max 1 раз/сутки/привычку |
| 7 | Связь с воркспейсом | Личные сущности **не** создают `Card`; отдельные таблицы Prisma |
| 8 | Онбординг | После создания персонажа без воркспейса → редирект на `/personal` с пресетами привычек |
| 9 | i18n | Только `titleRu` / `descriptionRu` в v1 (как квесты) |

---

## Три колонки UI (концепт)

> **Макеты вёрстки:** [docs/mockups/personal-habits-layouts.html](mockups/personal-habits-layouts.html) — 10 вариантов + сравнение названий вкладки rail.  
> **Кнопка «История» в задачах:** [docs/mockups/personal-todo-history-button-variants.html](mockups/personal-todo-history-button-variants.html) — 5 вариантов.

```
┌─────────────────┬─────────────────┬─────────────────┐
│   ПРИВЫЧКИ      │ ЕЖЕДН. ЗАДАЧИ  │    ЗАДАЧИ       │
│  (повторяемые)  │  (сброс в сутки)│  (разовые)      │
├─────────────────┼─────────────────┼─────────────────┤
│ [+] Бег         │ ☐ Утр. зарядка  │ ☐ Сдать отчёт   │
│     12 · 🔥 5   │ ☐ 8 стаканов    │ ☐ Позвонить маме│
│ [−] Курение     │ ☑ Медитация ✓   │                 │
│ [+/−] Чтение    │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
         │                  │                 │
         └──────────────────┴─────────────────┘
                    XP / HP / квесты / achievements
```

### 1. Привычки (`PersonalHabit`)

Повторяемые действия без жёсткого дедлайна.

| Поле | Описание |
|------|----------|
| `polarity` | `POSITIVE` (только +), `NEGATIVE` (только −), `BOTH` |
| `title`, `emoji?`, `color?` | Отображение в списке |
| `sortOrder`, `archivedAt` | Порядок и архив |
| `streakCurrent`, `streakBest` | Серия положительных отметок подряд (игровые сутки с ≥1 «+») |
| `positiveCount`, `negativeCount` | Статистика (для achievements) |

**Действия:**

- **+** — лог положительной отметки → XP (если не исчерпан лимит привычек за день) + прогресс квестов + HP +5 (через `addExperience`).
- **−** — лог отрицательной → HP −5 (`HealthEvent`), без XP; для `POSITIVE`-only привычки кнопка скрыта.

**Лимит:** не более **10** положительных отметок привычек с XP за игровые сутки (отдельно от лимита «тасков»). Повторная отметка той же привычки в те же сутки — без XP (идемпотентность по `habitId + dayKey`), но счётчик `positiveCount` растёт.

### 2. Ежедневные задачи (`PersonalDaily`)

Задачи, которые **сбрасываются каждый игровой день** (`GAME_DAY_TZ`).

| Поле | Описание |
|------|----------|
| `title`, `schedule` | v1: `EVERY_DAY`; v2: bitmask дней недели |
| `sortOrder`, `archivedAt` | |
| `lastCompletedDayKey` | Дата последнего выполнения |
| `streakCurrent`, `streakBest` | Серия дней без пропуска |

**Действия:**

- Отметить выполненной → XP (входит в общий лимит 5 «тасков»/сутки) + квесты + авто-чекин при первом XP за день (как карточка).
- **Cron** в конце игровых суток: для каждой активной ежедневной задачи без `completedAt` за `dayKey` → `applyMissedDailyPenalty` (−5 HP, один раз за пропущенную ежедневную задачу, cap −15 HP/сутки от пропусков).

### 3. Задачи (`PersonalTodo`)

Разовый todo-лист (не сбрасывается).

| Поле | Описание |
|------|----------|
| `title`, `notes?`, `dueAt?` | |
| `isCompleted`, `completedAt` | |
| `sortOrder`, `archivedAt` | |

**Действия:**

- Переход `isCompleted: false → true` → XP (общий лимит 5/сутки) + квесты. Повторное открытие без повторного XP (идемпотентность по `todoId`).

---

## Интеграция с геймификацией

### XP-события (расширение `XpEventType`)

```prisma
enum XpEventType {
  TASK_COMPLETED          // существующее — карточка workspace
  DAILY_CHECKIN
  CHECKIN_STREAK
  PERSONAL_TODO_COMPLETED // новое
  PERSONAL_DAILY_COMPLETED
  HABIT_POSITIVE          // новое
}
```

**Уникальности `XpEvent`:**

| type | unique key |
|------|------------|
| `PERSONAL_TODO_COMPLETED` | `(userId, type, personalTodoId)` |
| `PERSONAL_DAILY_COMPLETED` | `(userId, type, personalDailyId, dayKey)` |
| `HABIT_POSITIVE` | `(userId, type, personalHabitId, dayKey)` — макс. 1 XP-событие на привычку в сутки |

Поля в `XpEvent`: добавить nullable `personalTodoId`, `personalDailyId`, `personalHabitId` (аналог `cardId`).

### Константы наград (`gamification/config/rewards.ts`)

| Константа | Предложение | Примечание |
|-----------|-------------|------------|
| `XP_PER_PERSONAL_TODO` | 100 | = `XP_PER_TASK_COMPLETED` |
| `XP_PER_PERSONAL_DAILY` | 100 | то же |
| `XP_PER_HABIT_POSITIVE` | 25 | Меньше — привычки кликаются чаще |
| `DAILY_ACTIVITY_XP_MAX` | 500 | Суммарно XP за карточки, личное и привычки за сутки |
| `HP_MISSED_DAILY_PENALTY` | 5 | За каждую пропущенную ежедневную задачу |
| `HP_MISSED_DAILIES_DAILY_CAP` | 15 | Не убивать персонажа одной ночью |

Синхронизировать с `frontend/src/lib/xpRewards.ts`.

### Квесты (расширение `QuestMetric`)

```prisma
enum QuestMetric {
  // ... существующие
  PERSONAL_TODOS_COMPLETED
  PERSONAL_DAILIES_COMPLETED
  HABIT_POSITIVE_LOGGED
  PERSONAL_DAILIES_ALL_DONE   // все активные ежедневные задачи за день
}
```

**Примеры шаблонов (seed):**

| key | period | metric | target | сундук | titleRu |
|-----|--------|--------|--------|--------|---------|
| `daily_personal_3` | DAILY | `PERSONAL_ACTIONS_COMPLETED` | 3 | COMMON | Выполнить 3 личных дела |
| `daily_habits_5` | DAILY | `HABIT_POSITIVE_LOGGED` | 5 | COMMON | Отметить 5 привычек |
| `daily_habits_10` | DAILY | `HABIT_POSITIVE_LOGGED` | 10 | COMMON | Отметить 10 привычек |
| `weekly_personal_15` | WEEKLY | `PERSONAL_ACTIONS_COMPLETED` | 15 | RARE | Выполнить 15 личных дел |
| `weekly_perfect_dailies_5` | WEEKLY | `PERSONAL_DAILIES_ALL_DONE` | 5 | RARE | 5 идеальных дней |
| `monthly_habits_100` | MONTHLY | `HABIT_POSITIVE_LOGGED` | 100 | EPIC | Отметить 100 привычек |
| `monthly_personal_50` | MONTHLY | `PERSONAL_ACTIONS_COMPLETED` | 50 | EPIC | Выполнить 50 личных дел |

\* `PERSONAL_ACTIONS_COMPLETED` = todo + daily complete. ~~`daily_all_dailies`~~ — отключён.

### Достижения (seed)

Иконки новых ачивок — `uploads/ui/achievments/universal.png` (fallback в `achievementIconUrl`).

**Примеры:**

| key | metric | target | titleRu |
|-----|--------|--------|---------|
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

~~`first_personal_task`~~, ~~`first_habit_plus`~~ — отключены (`active = false`).

Хуки: после каждого XP-события / cron пропусков → `QuestProgressService.record*` + `AchievementService.recordProgress`.

### Мана и рейд-боссы

Личные задачи с XP **дают ману** (`MANA_PER_TASK_COMPLETED`), как карточки — иначе соло-игроки не участвуют в пати-рейдах. Единый счётчик `dailyActivityXpEarned` на карточки, личное и привычки.

### Чекин и неактивность

- Первое XP за день (карточка **или** личная задача **или** ежедневная задача **или** привычка) → авто `DAILY_CHECKIN` (существующая логика в `addExperience`).
- Cron `applyInactivityHpPenalty` — без изменений; solo-пользователь должен логировать хотя бы одно XP-событие за игровые сутки.

---

## Модель данных (Prisma, черновик)

```prisma
model PersonalHabit {
  id              Int       @id @default(autoincrement())
  userId          Int       @map("user_id")
  title           String
  polarity        HabitPolarity
  emoji           String?
  color           String?
  sortOrder       Int       @default(0) @map("sort_order")
  streakCurrent   Int       @default(0) @map("streak_current")
  streakBest      Int       @default(0) @map("streak_best")
  positiveCount   Int       @default(0) @map("positive_count")
  negativeCount   Int       @default(0) @map("negative_count")
  archivedAt      DateTime? @map("archived_at")
  createdAt       DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, archivedAt])
}

model PersonalDaily {
  id                   Int       @id @default(autoincrement())
  userId               Int       @map("user_id")
  title                String
  schedule             DailySchedule @default(EVERY_DAY)
  sortOrder            Int       @default(0) @map("sort_order")
  streakCurrent        Int       @default(0) @map("streak_current")
  streakBest           Int       @default(0) @map("streak_best")
  lastCompletedDayKey  DateTime? @map("last_completed_day_key") @db.Date
  archivedAt           DateTime? @map("archived_at")
  createdAt            DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, archivedAt])
}

model PersonalTodo {
  id          Int       @id @default(autoincrement())
  userId      Int       @map("user_id")
  title       String
  notes       String?
  dueAt       DateTime? @map("due_at")
  isCompleted Boolean   @default(false) @map("is_completed")
  completedAt DateTime? @map("completed_at")
  sortOrder   Int       @default(0) @map("sort_order")
  archivedAt  DateTime? @map("archived_at")
  createdAt   DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isCompleted, archivedAt])
}

enum HabitPolarity {
  POSITIVE
  NEGATIVE
  BOTH
}

enum DailySchedule {
  EVERY_DAY
  // WEEKDAYS, CUSTOM — Phase 2
}
```

Логи отрицательных привычек — через существующий `HealthEvent` с новым `HealthEventReason.HABIT_NEGATIVE` (или `MISSED_DAILY`).

---

## API (черновик)

Базовый префикс: `/personal` (JWT). Требуется персонаж для действий с наградами (как карточки).

| Method | Path | Назначение |
|--------|------|------------|
| GET | `/personal` | Сводка: habits + dailies + todos за текущий `dayKey` |
| **Привычки** | | |
| POST | `/personal/habits` | Создать |
| PATCH | `/personal/habits/:id` | Редактировать / архивировать |
| POST | `/personal/habits/:id/log` | `{ direction: 'positive' \| 'negative' }` → rewards / HP |
| POST | `/personal/habits/reorder` | `{ orderedIds: number[] }` |
| **Ежедневные задачи** | | |
| POST | `/personal/dailies` | Создать |
| PATCH | `/personal/dailies/:id` | Редактировать |
| POST | `/personal/dailies/:id/complete` | Выполнить за сегодня → `{ ok, rewards? }` |
| POST | `/personal/dailies/reorder` | |
| **Задачи** | | |
| POST | `/personal/todos` | Создать |
| PATCH | `/personal/todos/:id` | Обновить / complete / uncomplete |
| POST | `/personal/todos/reorder` | |
| **Онбординг** | | |
| POST | `/personal/onboarding/apply-presets` | Набор из 3–5 пресетов привычек + 2 ежедневные задачи |

**Коды ошибок** (добавить в сервис + `API_ERROR_CODE_RU`):

| code | HTTP | Когда |
|------|------|--------|
| `PERSONAL_DAILY_ALREADY_DONE` | 409 | Повторное выполнение ежедневной задачи за `dayKey` |
| `DAILY_ACTIVITY_XP_LIMIT` | 409 | Сумма XP за активность > 500 за сутки |
| `HABIT_LOG_NOT_ALLOWED` | 400 | «−» на POSITIVE-only |
| `CHARACTER_NOT_FOUND` | 404 | Нет персонажа |

---

## Backend: структура модулей

```
backend/src/personal/
├── personal.module.ts
├── personal.controller.ts
├── personal.service.ts          ← CRUD + оркестрация
├── personal-reward.service.ts   ← log habit, complete daily/todo → addExperience
├── dto/
├── config/
│   ├── habit-presets.ts         ← онбординг
│   └── personal-rewards.ts      ← реэкспорт из gamification/config или локальные константы
└── tests/
```

**Зависимости:**

- `PersonalModule` → `CharacterModule`, `GamificationModule` (quest + achievement hooks).
- `GamificationCronService` → добавить `processMissedPersonalDailies()` после полуночи `GAME_DAY_TZ`.
- **Не** тянуть `CardModule`.

**Паттерн награды** (как `CardService.setCardCompletion`):

1. Валидация владельца и состояния.
2. `prisma.$transaction`: обновление сущности + `characterService.addExperience` + `questProgressService.record*` + `achievementService.record*`.
3. Ответ `{ ok, rewards?: XpGrantRewards }` для toast на фронте.

---

## Frontend (реализовано)

| Маршрут | Файлы | Роль |
|---------|-------|------|
| `/personal` | `pages/personal/PersonalPage.tsx` | Три колонки в одном экране |
| — | `pages/personal/usePersonalBoard.ts` | Загрузка доски, optimistic complete/log |
| — | `entities/personal/api/personalApi.ts` | REST-клиент |
| — | `app/styles/personal-page.css` | Стили колонок, карточек, кнопок +/− |

**Колонки:** «Привычки» (кнопки +/−, выбор полярности при добавлении), «Ежедневные» (чекбокс как на доске), «Задачи» (чекбокс + ссылка «История» → модалка архива).

**Навигация:** rail **«Привычки»** (`active === 'personal'`).

**UI-паттерны:** `+ Добавить…` с раскрывающимся полем; `RewardGrantToast` / `TaskRewardToast`; без счётчика «XP сегодня» в шапке; оптимистичное обновление без полной перезагрузки доски.

**Backlog UI:** DnD reorder внутри колонок; визуал «пропущено вчера» на ежедневных задачах.

**Пустое состояние:** CTA в колонках; онбординг-пресеты через API.

---

## Фазы реализации

### Phase 6a — MVP данные и задачи

- [x] Prisma: `PersonalTodo`, `PERSONAL_TODO_COMPLETED`, миграция `XpEvent.personalTodoId`
- [x] `PersonalModule`, CRUD todos, complete → XP
- [x] `QuestMetric.PERSONAL_TODOS_COMPLETED` + daily quest seed
- [x] `AchievementMetric.PERSONAL_TODOS_COMPLETED_TOTAL` + achievement seed
- [x] `PersonalPage` — колонка «Задачи» (+ две другие в v1)
- [x] Иконка в rail, `/personal` в меню

### Phase 6b — Ежедневные задачи

- [x] `PersonalDaily`, complete, cron пропусков (`processMissedPersonalDailies`)
- [x] Квесты `PERSONAL_DAILIES_*`, achievement seed
- [x] Колонка «Ежедневные задачи» (визуал «пропущено вчера» — backlog UI)

### Phase 6c — Привычки

- [x] `PersonalHabit`, log +/−, streak, лимиты
- [x] `HABIT_POSITIVE` XP, `HealthEvent` для «−»
- [x] Квесты/achievements на привычки
- [x] Колонка «Привычки»

### Phase 6d — Онбординг и полировка

- [x] Пресеты привычек, редирект после `CharacterSetupPage` если нет workspace
- [ ] Обновить `GamificationGuide` — раздел «Личное»
- [ ] E2E: создать todo → XP → квест progress
- [x] Обновить [gamification-agent-context.md](gamification-agent-context.md) (статус Phase 6)

---

## Баланс и анти-абьюз

| Риск | Митигация |
|------|-----------|
| Фарм XP кликами по привычкам | 1 XP-событие / привычка / день; общий cap 500 XP / день |
| Фарм через todo create/complete | XP только на `false → true`; unique по `todoId` |
| Обход лимита через карточки + личное + привычки | Общий `dailyActivityXpEarned` на все источники активности |
| Пропуск ежедневных задач без последствий | HP penalty + визуал «пропущено» |
| Solo не в пати | Мана с личных XP — равные условия для рейдов |

---

## Отличия от Habitica (намеренно)

| Habitica | Questflow |
|----------|-----------|
| Классы, экипировка со статами | Только косметика (инвариант v1) |
| Урон от боссов при пропуске dailies | Только HP penalty, без блокировки UI |
| Отдельная валюта золота | XP + сундуки + пыль (существующая экономика) |
| Гильдии / квесты в чате | Квесты через `QuestTemplate`; социал — друзья/рейд (опционально) |
| Все задачи в одном списке | Чёткое разделение: командные карточки vs личное |

---

## Вне scope v1

| Фича | Примечание |
|------|------------|
| Напоминания push/email | Backlog |
| Повторяющиеся todo (weekly/monthly) | После dailies |
| Теги / проекты в личном | Backlog |
| Импорт из Habitica / Todoist | Backlog |
| Совместные привычки пары | Социальный backlog |
| Отдельный лимит XP только для solo | Пока общий пул |

---

## Чеклист после реализации

- [x] Константы: `rewards.ts` ↔ `xpRewards.ts`
- [x] Новые `code` в Swagger + `api.ts`
- [ ] Unit-тесты: `personal-reward.service`, cron missed dailies
- [x] Seed квестов и achievements (миграции `20260611220000_personal_habits`, `20260611230000_personal_habits_quests_achievements`, `20260611240000_personal_quests_achievements_finalize`)
- [x] Статус Phase 6 в [gamification-agent-context.md](gamification-agent-context.md)
- [x] Пункт в README «Основные сценарии → Привычки»
- [x] Каталог квестов solo — [gamification-roadmap.md](gamification-roadmap.md)

---

*Обновлять этот файл при изменении scope, баланса или API solo-режима.*
