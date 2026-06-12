# Questflow — контекст для AI-агента (геймификация)

Сжатая «память проекта» для итераций в Cursor: где код, какие инварианты, что делать следующим, что обновить после правок.

**Связанные документы:**

- [gamification-roadmap.md](gamification-roadmap.md) — продуктовый план, фазы, баланс, квесты, сундуки
- [gamification-assets.md](gamification-assets.md) — ТЗ на графику (размеры, ключи, папки)
- [profile-settings-roadmap.md](profile-settings-roadmap.md) — профиль аккаунта, `/settings`, privacy (не геймификация)
- [ui-themes.md](ui-themes.md) — pixel UI темы: default + разблокировка 2–5 из сундука (backlog)
- [README.md](../README.md) — обзор приложения


---

## Статус на момент документа

| Phase | Состояние |
|-------|-----------|
| 0 | **Done** — персонаж, XP за карточку, уровни, HP+5, UI |
| 0.5 | **Done** — cron сброс `dailyActivityXpEarned`, `rewards.ts`, константы в сервисах |
| 1 | **Done** |
| 2 | **Done** — **2a** квесты + **2b** сундуки (сундук **за каждый** квест; карточки → assignee ?? actor) |
| 3 | **Done** — пыль (дубликаты + магазин 3 сундуков), achievements |
| 4 | **In progress** — гайд «Как это работает» + intro ([`GamificationGuide.tsx`](../frontend/src/widgets/gamification-guide/GamificationGuide.tsx)); E2E и backlog (уведомления / battle pass / лидерборд) — [roadmap](gamification-roadmap.md#phase-4--e2e-и-гайд-по-игре-финал-v1) |
| 4.social | **Done (MVP)** — друзья по `friendCode` (#1492), заявки accept/decline, DM 1:1 (REST + poll 5 с в открытом чате), коллеги из общего workspace могут писать без дружбы |
| 5.party | **In progress** — рейд-боссы для пати друзей (2–8), мана за XP-карточки, урон в % HP, kick лидером / голосованием |
| 6.personal | **Done (v1)** — `/personal`: привычки / ежедневные / задачи, XP/HP, квесты, cron пропусков dailies; см. [solo-habits-roadmap.md](solo-habits-roadmap.md) |
| 6.ws-order | **Done** — `WorkspaceMember.sortOrder`, DnD на `/workspaces`; API `PATCH /workspace/reorder-user-workspace` |

**Суточный сброс:** cron `resetDailyTaskXpCounts` в `GamificationCronService` (00:00 `GAME_DAY_TZ`) обнуляет `dailyActivityXpEarned`. Числа наград — `backend/src/gamification/config/rewards.ts`.

**Каталог квестов и achievements:** [gamification-roadmap.md § Квесты](gamification-roadmap.md#квесты--полный-каталог-активные-шаблоны).

---

## Разделы приложения (кратко)

| Раздел | Маршрут | Backend / ключевые модули |
|--------|---------|---------------------------|
| Привычки (solo) | `/personal` | `personal/*`, `personal-reward.service.ts` |
| Воркспейсы | `/workspaces` | `workspace/*`, reorder `sortOrder` |
| Доска | `/workspaces/:ws/boards/:board` | `card`, `list`, `board` |
| Персонаж | `/profile/character` | `character`, `gamification/quest`, `chest` |
| Сообщения | `/messages` | `social/*` |
| Рейд | UI на профиле / пати | `party/*` |

Rail: вкладка **«Привычки»** → `/personal` (между «Доски» и «Персонаж»). Полная таблица — [gamification-roadmap.md § Разделы](gamification-roadmap.md#разделы-приложения-маршруты).

---

## Константы (синхронизировать backend ↔ frontend при изменении)

| Константа | Значение | Backend | Frontend |
|-----------|----------|---------|----------|
| XP за карточку | 100 | `gamification/config/rewards.ts` → `XP_PER_TASK_COMPLETED` | `lib/xpRewards.ts` |
| Дневной чекин | 100 | `XP_DAILY_CHECKIN` | `XP_DAILY_CHECKIN` |
| Лимит XP активности / сутки | 500 | `DAILY_ACTIVITY_XP_MAX` — карточки + личные + привычки | `DAILY_ACTIVITY_XP_MAX` |
| XP за личную задачу / ежедневную задачу | 100 | `XP_PER_PERSONAL_TODO`, `XP_PER_PERSONAL_DAILY` | `xpRewards.ts` |
| XP за привычку «+» | 25 | `XP_PER_HABIT_POSITIVE` | `XP_PER_HABIT_POSITIVE` |
| Чекин + пороги серии | +100 / бонусы | Вне лимита 500; max ~600/день без milestone | — |
| HP за «−» привычку / пропуск daily | −5 | `HP_HABIT_NEGATIVE_PENALTY`, `HP_MISSED_DAILY_PENALTY` | — |
| Штраф «−» привычка / сутки | max 1 / привычку | `PersonalHabitNegativeLog` unique `(userId, habitId, dayKey)` | — |
| Стрик привычки «+» | +1 каждый клик | `personal-reward.service` | UI 🔥 на карточке |
| Стрик при «−» | сброс в 0 | `personal-reward.service` | — |
| Cap HP за пропуски dailies / сутки | −15 | `HP_MISSED_DAILIES_DAILY_CAP` | — |
| HP за XP-событие | +5, max 100 | `HP_GAIN_PER_XP_EVENT` в `addExperience` | — |
| Мана max | 100 | `MANA_MAX` в `rewards.ts` | `xpRewards.ts` |
| Мана за XP-карточку | +5 (только с XP, cap) | `MANA_PER_TASK_COMPLETED` | `MANA_PER_TASK_COMPLETED` |
| Удар по боссу | −5 маны | `BOSS_ATTACK_MANA_COST` | — |
| Бюджет % HP пати / сутки | 40 | `BOSS_DAILY_PARTY_BUDGET_PCT` | — |
| Пати рейда | 2–8 | `BOSS_MIN/MAX_PARTY_SIZE` | — |
| Активных рейдов на игрока | 2 | `MAX_ACTIVE_RAIDS_PER_USER` | `xpRewards.ts` |
| Штраф за вчера без активности | −5 | `HP_INACTIVITY_PENALTY`, cron `applyInactivityHpPenalty` | — |
| Grace period | 24 ч | `CHARACTER_GRACE_PERIOD_MS` | — |
| Уровни | 1–100 | `character/config/level-curve.ts` | `lib/level-curve.ts` (дубль кривой) |

`XpEvent.dayKey`: для `DAILY_CHECKIN` / `CHECKIN_STREAK` обязателен в `addExperience`; игровой день — `gamification/core/game-day.ts` + `GAME_DAY_TZ`.

---

## Константы, типы, ошибки

| Что | Где |
|-----|-----|
| Числа (XP, HP, лимиты) | `gamification/config/rewards.ts`, `config/checkin-streak-milestones.ts` |
| TZ, списки enum | `gamification/constants.ts` |
| Типы XP-транзакции | `gamification/xp/interface/*.interface.ts` + `index.ts` |
| Ошибки API `{ code, message }` | **`character.service.ts`** — и CRUD персонажа, и XP/серия (приватные `throwXpEvent…`, без отдельной папки `errors/`) |

**Коды геймификации (в `character.service`):**

| code | HTTP | Когда |
|------|------|--------|
| `XP_EVENT_DAY_KEY_REQUIRED` | 400 | `DAILY_CHECKIN` / `CHECKIN_STREAK` без `dayKey` |
| `DAILY_ACTIVITY_XP_LIMIT` | 409 | Сумма XP за карточки / todo / daily / привычки > 500 за игровые сутки |
| `PERSONAL_DAILY_ALREADY_DONE` | 409 | Повтор complete daily за тот же `dayKey` |
| `HABIT_LOG_NOT_ALLOWED` | 400 | «−» на POSITIVE-only или «+» на NEGATIVE-only |
| `XP_EVENT_ALREADY_RECORDED` | 409 | Повтор XP за ту же карточку (P2002) |
| `CHECKIN_ALREADY_DONE` | 409 | Повтор серии за тот же `dayKey` (P2002) |

**Фронт:** `isXpGrantErrorCode` в `api.ts` — `DAILY_ACTIVITY_XP_LIMIT` (и legacy `DAILY_TASK_XP_LIMIT` / `DAILY_HABIT_XP_LIMIT`) / `XP_EVENT_ALREADY_RECORDED` / `CHARACTER_NOT_FOUND` не откатывают галочку и **без UI-оповещения** на доске. Новый код → `throw` в сервисе + `@ApiResponse`.

---

## Карта файлов (куда лезть)

```
questflow/
├── docs/
│   ├── gamification-roadmap.md        ← продукт и фазы
│   └── gamification-agent-context.md  ← этот файл (статус, паттерны)
├── backend/
│   ├── prisma/schema.prisma           ← Character, XpEvent, enums
│   ├── src/character/
│   │   ├── character.service.ts       ← addExperience → XpGrantResult, streak, авто-чекин
│   │   ├── character.controller.ts    ← GET/POST/PATCH /character
│   │   ├── character.module.ts        ← exports CharacterService
│   │   └── config/level-curve.ts      ← кривая уровней
│   ├── src/gamification/
│   │   ├── gamification.module.ts, constants.ts, index.ts
│   │   ├── config/          ← rewards, loot-table, checkin milestones
│   │   ├── core/            ← game-day, streak, inactivity, card-reward-user
│   │   ├── xp/interface/    ← типы XpGrant*
│   │   ├── quest/           ← quest-period, quest-progress.service
│   │   ├── chest/           ← chest.service
│   │   ├── dust/            ← dust.service, config/dust.ts
│   │   ├── achievement/     ← achievement.service
│   │   ├── cron/            ← gamification-cron.service
│   │   └── */tests/*.spec.ts  ← unit-тесты рядом с фичей
│   ├── src/card/card.service.ts       ← setCardCompletion → XP + recordCardCompleted
│   └── src/card/card.module.ts        ← GamificationModule
│   ├── src/social/                    ← friends, DM, canMessage (friends | shared WS)
│   │   ├── social.service.ts
│   │   ├── social.controller.ts       ← /social/*
│   │   └── lib/friend-code.ts         ← 1000–9999, format #1492
│   ├── src/party/                     ← party boss raids (Phase 5.party)
│   │   ├── party.service.ts
│   │   ├── party.controller.ts        ← /party/*
│   │   ├── config/boss-templates.ts
│   │   └── lib/boss-damage.ts
│   ├── src/personal/                  ← solo habits (Phase 6)
│   │   ├── personal.controller.ts     ← /personal/*
│   │   ├── personal.service.ts
│   │   ├── personal-reward.service.ts
│   │   └── config/habit-presets.ts
│   ├── src/workspace/
│   │   ├── workspace.controller.ts    ← incl. reorder-user-workspace
│   │   ├── workspace.service.ts
│   │   └── lib/member-sort-order.ts
├── frontend/
│   ├── src/pages/personal/PersonalPage.tsx
│   ├── src/pages/personal/usePersonalBoard.ts  ← optimistic complete/log
│   ├── src/pages/workspaces/WorkspacesPage.tsx ← DnD порядка WS
│   ├── src/pages/profile-character/ProfileCharacterPage.tsx
│   ├── src/widgets/profile-character-quests/ProfileCharacterQuestsPanel.tsx
│   ├── src/entities/personal/         ← API + types
│   ├── src/app/AppRoot.tsx            ← роуты, rail
│   ├── src/pages/character-setup/CharacterSetupPage.tsx  ← редирект → `/personal` если нет WS
│   ├── src/GamificationIntroModal.tsx
│   ├── src/GamificationGuide.tsx       ← полный гайд на профиле
│   ├── src/CheckinStreakCounter.tsx   ← счётчик серии + анимация roll
│   ├── src/CheckinStreakProfileRow.tsx ← streak + кнопка (i) + модалка порогов
│   ├── src/RewardGrantToast.tsx       ← XP/чекин/HP/streak при закрытии карточки
│   ├── src/CharacterPortraitWithFrame.tsx ← портрет + рамка
│   ├── src/UserCharacterPage.tsx      ← чужой персонаж (read-only)
│   ├── src/BoardPage.tsx              ← парсит rewards с completion API
│   ├── src/lib/gamificationRewards.ts
│   ├── src/lib/gamificationIntro.ts   ← sessionStorage после register
│   ├── src/lib/xpRewards.ts           ← константы XP (должны = backend)
│   ├── src/lib/level-curve.ts         ← расчёт полоски XP
│   ├── src/lib/character.ts           ← CharacterDto, portrait URLs (+ clear_man overrides для male)
│   ├── src/lib/cosmetics.ts           ← URL рамок/фонов, portraitFrameFitVars()
│   ├── src/lib/chestAssets.ts         ← tap-кадры common (0–4), rare (1–5), иконка
│   ├── src/ChestIcon.tsx              ← иконка сундука в квестах
│   ├── src/ChestTapOpenModal.tsx      ← tap-to-open (Clash Royale), большой сундук
│   ├── src/lib/dustAssets.ts          ← dust/dust.png
│   ├── src/DustIcon.tsx               ← иконка пыли (24 / 48 px)
│   ├── entities/achievement/lib/achievementAssets.ts   ← иконки achievements по key + universal fallback
│   ├── shared/assets/uiAssets.ts   ← xp, check, level, health, mana, intro
│   ├── entities/party/lib/bossAssets.ts   ← иконки боссов рейда
│   ├── src/lib/uiAssets.ts            ← UI-иконки геймификации (xp toast)
│   ├── src/lib/portraitLayout.ts      ← bbox/inset/классы (блок 2a assets)
│   ├── src/entities/social/           ← API, useMessagePolling (5 s)
│   ├── src/widgets/social-friends/    ← FriendsPanel
│   ├── src/widgets/social-messages/   ← MessagesPanel, ConversationView
│   └── src/lib/api.ts                 ← isXpGrantErrorCode
```

- `ScheduleModule.forRoot()` в `app.module.ts`; env: `GAME_DAY_TZ` в `backend/.env.example`

---

## API персонажа (реализовано)

| Method | Path | Auth |
|--------|------|------|
| GET | `/character/me` | JWT |
| GET | `/character/user/:userId` | JWT |
| POST | `/character` | JWT, один раз |
| PATCH | `/character/me` | JWT |
| POST | `/character/checkin` | JWT, 1× за игровые сутки |

Swagger: `http://localhost:3000/api/docs` → tag `character`.

| GET | `/character/quests` | JWT — дневные/недельные квесты + прогресс |
| GET | `/character/chests` | JWT |
| POST | `/character/chests/:chestId/open` | JWT |
| GET | `/character/chests` | JWT — все сундуки пользователя (блок «Мои сундуки» на профиле) |
| GET | `/character/inventory` | JWT |
| PATCH | `/character/cosmetics/equip` | JWT, body `{ inventoryItemId }` |
| GET | `/character/achievements` | JWT |
| GET | `/character/dust/shop` | JWT — баланс + 3 варианта сундука |
| POST | `/character/dust/purchase` | JWT, body `{ tier }` |

Лут (актуально): common-сундук может дать `bg_meadow`, `bg_woods`, `bg_lake_forest`; rare — `bg_night`.

**Запланировано:** `POST /character/checkin/weekly` (optional). Phase 4: уведомления, battle pass, лидерборд.

### Social (MVP, JWT)

| Method | Path | Назначение |
|--------|------|------------|
| GET | `/social/me/code` | Свой `friendCode` (`#1492`) |
| POST | `/social/friends/request` | `{ friendCode }` — заявка |
| GET | `/social/friends` | Список друзей |
| GET | `/social/friends/requests/incoming` \| `outgoing` | Заявки |
| POST | `/social/friends/requests/:id/accept` \| `decline` | Ответ на заявку |
| DELETE | `/social/friends/:userId` | Убрать из друзей |
| GET | `/social/users/:userId/relation` | `isFriend`, `canMessage`, pending ids |
| GET | `/social/messages/conversations` | Диалоги + unread |
| GET | `/social/messages/with/:userId?since=` | История / poll новых |
| POST | `/social/messages/with/:userId` | `{ body }` |
| PATCH | `/social/messages/read` | `{ userId }` — прочитано |

**Правила:** `Character.friendCode` при create; писать можно друзьям (`ACCEPTED`) или при общем workspace (`UserService.assertProfileAccess`). Коды: `MESSAGE_NOT_ALLOWED`, `FRIEND_CODE_NOT_FOUND`, … — `shared/api/api.ts`.

**Не в v1:** WebSocket, групповые чаты, блокировка, поиск по имени.

### Personal / solo (Phase 6, JWT)

| Method | Path | Назначение |
|--------|------|------------|
| GET | `/personal` | Доска: habits + dailies + todos |
| GET | `/personal/todos/completed?limit=&offset=` | История выполненных задач (пагинация по 10) |
| POST | `/personal/habits` | Создать (`polarity`: POSITIVE / NEGATIVE / BOTH) |
| PATCH | `/personal/habits/:id` | Редактировать / архивировать |
| POST | `/personal/habits/:id/log` | `{ direction: 'positive' \| 'negative' }` → XP/HP |
| POST | `/personal/habits/reorder` | `{ orderedIds: number[] }` |
| POST | `/personal/dailies` | Создать ежедневную задачу |
| POST | `/personal/dailies/:id/complete` | Complete → XP (общий task-like лимит) |
| POST | `/personal/dailies/reorder` | Сортировка |
| POST | `/personal/todos` | Создать задачу |
| PATCH | `/personal/todos/:id` | Обновить / complete / uncomplete |
| POST | `/personal/todos/reorder` | Сортировка |
| POST | `/personal/onboarding/apply-presets` | Пресеты при первом входе |

**Поведение привычек:** «+» — `streakCurrent++` всегда; XP (`HABIT_POSITIVE`) — max 1×/привычку/`dayKey`. «−» — `streakCurrent = 0`; HP −5 max 1×/привычку/`dayKey` через `PersonalHabitNegativeLog`.

**UI:** три колонки, оптимистичные обновления (`usePersonalBoard`), история задач (модалка), тип привычки при создании. DnD reorder колонок — backlog.

**Cron:** `processMissedPersonalDailies()` — HP −5 за пропуск, cap −15/сутки. Спека: [solo-habits-roadmap.md](solo-habits-roadmap.md).

### Workspace list (не геймификация, JWT)

| Method | Path | Назначение |
|--------|------|------------|
| GET | `/workspace/get-user-workspaces` | Список WS пользователя (`sortOrder` asc) |
| PATCH | `/workspace/reorder-user-workspace` | `{ memberId, position }` — DnD на `/workspaces` |

### Party boss (Phase 5.party, JWT)

| Method | Path | Назначение |
|--------|------|------------|
| GET | `/party/bosses` | Каталог боссов (3 шт.) |
| POST | `/party/raids` | `{ bossKey, friendUserIds[] }` — создать рейд + инвайты |
| GET | `/party/raids/mine` | Активный рейд / инвайты |
| POST | `/party/raids/:id/accept` \| `decline` | Ответ на инвайт |
| POST | `/party/raids/:id/start` | Старт (лидер, ≥2 ACTIVE) |
| POST | `/party/raids/:id/attack` | Удар (−5 маны, −X% HP) |
| POST | `/party/raids/:id/members/:userId/kick` | Исключить (лидер) |
| POST | `/party/raids/:id/kick-votes` | `{ targetUserId }` — голосование |
| POST | `/party/raids/:id/kick-votes/:voteId/vote` | Голос «за» исключение |
| DELETE | `/party/raids/:id` | Отмена (лидер, только INVITING) |

**Правила:** мана только при XP за карточку (5/сутки × 5 = 25/день, cap 100). Урон: `40 / (activeMembers × 5)` % за удар. При kick — пересчёт урона, вклад сохраняется. Лут: boss chest `source=BOSS:{bossKey}:{raidId}`, порог вклада ≥5%. Один рейд INVITING/ACTIVE на игрока.

**Не в v1:** авто-кик по неактивности, второй параллельный рейд, пати >8, уникальный loot table (пока tier сундука по боссу).

---

## Точка входа: начисление XP за карточку

1. `PATCH` закрытие карточки → `CardService.setCardCompletion`.
2. Только переход `isCompleted: false → true`.
3. `xpUserId = card.assigneeId ?? actorUserId`.
4. `addExperience` → `{ character, rewards }` (`taskXp`, `checkinXp`, `hpGained`, `checkinStreak`, `streakIncreased`); авто `DAILY_CHECKIN` при первом XP за день.
5. Ответ completion: `{ ok, rewards? }` → `RewardGrantToast` на доске (без кнопки «Отметиться»).
6. Ошибки XP **не откатывают** `isCompleted` — `isXpGrantErrorCode` в `api.ts` (без snackbar/модалки для лимита).

```typescript
// Инвариант: без персонажа у user — CHARACTER_NOT_FOUND, карточка уже completed
// Инвариант: повтор той же карточки — P2002 → XP_EVENT_ALREADY_RECORDED
// Инвариант: XP активности > 500 за «сутки» без сброса — DAILY_ACTIVITY_XP_LIMIT
```

---

## Паттерны при добавлении механик

1. **Сервер решает** — UI отображает состояние; полный текст правил в гайде — [Phase 4](gamification-roadmap.md#phase-4--e2e-и-гайд-по-игре-финал-v1).
2. **Идемпотентность** — unique в Prisma + `ConflictException` с `code`, не silent ignore.
3. **Транзакция** — XP + связанный прогресс (квест) в одном `prisma.$transaction`.
4. **Расширять `addExperience`** (или вынести `grantReward`) — не дублировать level-up/HP в card/comment сервисах.
5. **Ошибки XP** — в `character.service` (`{ code, message }`); фронт — `isXpGrantErrorCode`, тихий return на доске.
6. **Миграции** — `npx prisma migrate dev` в `backend/`; клиент: `src/generated/prisma`.
7. **После изменения чисел** — backend config + `frontend/src/entities/reward/index.ts` (реэкспорт `xpRewards`); пункты гайда — при Phase 4 (до этого достаточно констант в UI).

---

## Backend (`backend/src/`)

### Unit-тесты (обязательно)

При изменении логики добавляй или обновляй **unit-тесты** (`*.spec.ts` рядом с модулем или в том же каталоге).

Покрывать реальное поведение: сервисы (`*.service.ts`), guards/filters/resolvers в `common/`, конфиг с логикой (`level-curve.ts`, `gamification/config/rewards.ts` и т.п.).

Паттерн: Jest, `createPrismaMock()` из `src/testing/prisma-mock.ts`, `new Service(mock)` без поднятия всего приложения. Тесты лежат в `{module}/tests/*.spec.ts` (или `{module}/{subfeature}/tests/`).

После правок: `cd backend && npm run test` (или `test:unit` при крупных изменениях). Пороги coverage в `package.json` — не ломать без явного запроса.

Не добавляй тесты «ради галочки» (тривиальные expect на константы), если поведение не менялось.

### Комментарии в коде

**Не добавляй** в `backend/src/**/*.ts` (кроме `*.spec.ts` при необходимости): блочные `/** ... */`, поясняющие `//`, JSDoc на экспортах.

Контекст для агента и продукт — в `docs/` (этот файл, [roadmap](gamification-roadmap.md)). Имена и типы — самодокументируемые.

Исключения: явная просьба пользователя; `eslint-disable`; внешний контракт, который нельзя выразить кодом.

---

## Модульная связность (NestJS)

- `CharacterModule` **exports** `CharacterService`.
- `CardModule` импортирует `CharacterModule` для XP при закрытии.
- Новый `GamificationModule` должен импортировать `PrismaModule`, экспортировать cron-сервис; `CharacterModule` может импортировать `GamificationModule` или общий `RewardsService` — избегать циклических imports (`CardModule` → `CharacterModule` уже есть).

---

## Prisma: важные ограничения

```prisma
// XpEvent — два partial unique (card vs day)
@@unique([userId, type, cardId])   // TASK_COMPLETED + cardId NOT NULL
@@unique([userId, type, dayKey])   // DAILY_CHECKIN + dayKey NOT NULL
```

Для `TASK_COMPLETED` не ставить `dayKey` (иначе конфликт семантики). Для чекинов — `cardId: null`, `dayKey: Date` (date-only).

`Character`: `userId` @unique — один персонаж на аккаунт; квесты считают активность по **всем** workspace.

---

## UI-заметки

| Страница | Роль |
|----------|------|
| `ProfileCharacterPage` | Редактирование, streak, квесты; гайд — Phase 4 |
| `UserCharacterPage` | Просмотр чужого персонажа |
| `BoardPage` | XP toast при complete; DnD карточек и колонок |
| `PersonalPage` | Solo-доска; toast наград; без счётчика XP в шапке |
| `WorkspacesPage` | Аккордеон WS; DnD порядка (ручка ⋮⋮) |

Показывать `dailyActivityXpEarned` в UI опционально (поле в API `Character`, `/personal` stats). Статус HP=0 «истощён» — опционально, Phase 2+ / polish.

---

## Очередь задач для агента (рекомендуемый порядок)

1. ~~**0.5a**~~ — done: `@nestjs/schedule`, `GamificationModule`, cron `resetDailyTaskXpCounts()` в `GAME_DAY_TZ`.
2. ~~**0.5b**~~ — done: `rewards.ts`, без magic numbers в `character.service` / `card.service`.
3. ~~**0.5c**~~ — done: `GAME_DAY_TZ` в `.env.example`, unit-тесты cron.
4. ~~**1a**~~ — done: `addExperience` + `dayKey`, `game-day.ts`, `POST /character/checkin`.
5. ~~**1b**~~ — done: `HealthEvent`, `applyInactivityHpPenalty`, HP +5 в `addExperience`, grace 48h.
6. ~~**1c**~~ — done: streak, HP bar, intro/toast, `CheckinStreakInfoModal`, анимация/баннер серии на профиле.
7. ~~**2a**~~ — done: квесты, hooks, `GET /character/quests`.
8. ~~**2b**~~ — done: сундуки, loot, open/inventory/equip, UI на профиле.
9. ~~**3**~~ — done: пыль, achievements, магазин сундуков.
10. ~~**4a**~~ — done: полный гайд. **2026-06:** `QUEST_MAGE_*` полностью убран (лут, CosmeticItem, инвентарь); enum в БД оставлен для совместимости.
11. **4b** — E2E + backlog (уведомления, battle pass, …).

После каждой фазы: обновить таблицу «Статус» в **этом файле**, [Known gaps](gamification-roadmap.md#known-gaps-история-phase-1-закрыта) и чеклисты Phase в roadmap.

---

## Команды разработки

```bash
# Стек (только app + pg + redis + frontend)
cd backend && docker compose up -d postgres redis app frontend

# Локально API
cd backend && npm run start:dev

# Миграции
cd backend && npx prisma migrate dev

# Swagger
# http://localhost:3000/api/docs
```

---

## Чего не делать без явного запроса

- Статов на снаряжении, влияющих на XP/HP (v1 — косметика only).
- Блокировки досок при HP=0 или низком уровне.
- Отдельный персонаж на workspace (продуктово решено: один на user).
- Дублировать планы в новых md — править [roadmap](gamification-roadmap.md) и **этот** agent-context.
- `git commit` без запроса пользователя.

---

## Чеклист после PR / итерации агента

- [ ] Константы совпадают backend ↔ `xpRewards.ts` (текст гайда — при Phase 4)
- [ ] Новый `code` в `character.service` + Swagger + `API_ERROR_CODE_RU` в `api.ts`
- [ ] Таблица «Статус» здесь и [Known gaps](gamification-roadmap.md#known-gaps-история-phase-1-закрыта) актуальны
- [ ] При новых таблицах — миграция + пример в Phase-чеклисте roadmap
- [ ] `cd backend && npm run test` проходит после изменений в `backend/src/`
- [ ] E2E и полный гайд — только в [Phase 4](gamification-roadmap.md#phase-4--e2e-и-гайд-по-игре-финал-v1), не в PR фич

---

## Профиль аккаунта vs персонаж

| Область | Документ | Маршруты |
|---------|----------|----------|
| Аккаунт, email, сессии, privacy, удаление | [profile-settings-roadmap.md](profile-settings-roadmap.md) | `/profile/character`, `/settings`, `/profile/:userId/character` |
| RPG (XP, квесты, сундуки, рейд) | этот файл + [gamification-roadmap.md](gamification-roadmap.md) | `/profile/character`, `/profile/:userId/character` |

Перед задачей по **настройкам или публичному профилю** читай `profile-settings-roadmap.md`, не дублируй план здесь.

---

## Связь с остальным приложением

Геймификация **не заменяет** workspace/board/card guards. Закрытие карточки по-прежнему через `CardService` + workspace membership. XP — побочный эффект успешного `setCardCompletion`; отсутствие персонажа у assignee не мешает закрыть карточку (ошибка только на grant XP).

Пыль: `config/dust.ts`, `dust.service.ts`. Дубликат при открытии сундука — `DUST_FOR_DUPLICATE_BY_TIER`. Коды: `CHEST_*`, `COSMETIC_*`, `INSUFFICIENT_DUST` — `API_ERROR_CODE_RU`.

---

*Обновлять этот файл при каждой итерации по геймификации (статус фаз, очередь, баги UI).*
