# Questflow — контекст для AI-агента (геймификация)

Сжатая «память проекта» для итераций в Cursor: где код, какие инварианты, что делать следующим, что обновить после правок.

**Связанные документы:**

- [gamification-roadmap.md](gamification-roadmap.md) — продуктовый план, фазы, баланс, квесты, сундуки
- [gamification-assets.md](gamification-assets.md) — ТЗ на графику (размеры, ключи, папки)
- [README.md](../README.md) — обзор приложения


---

## Статус на момент документа

| Phase | Состояние |
|-------|-----------|
| 0 | **Done** — персонаж, XP за карточку, уровни, HP+5, UI |
| 0.5 | **Done** — cron сброс `dailyTaskXpCount`, `rewards.ts`, константы в сервисах |
| 1 | **Done** |
| 2 | **Done** — **2a** квесты + **2b** сундуки (сундук **за каждый** квест; карточки → assignee ?? actor) |
| 3 | **Done** — пыль (дубликаты + магазин 3 сундуков), achievements |
| 4 | **In progress** — гайд «Как это работает» + intro ([`GamificationGuide.tsx`](../frontend/src/widgets/gamification-guide/GamificationGuide.tsx)); E2E и backlog (уведомления / battle pass / лидерборд) — [roadmap](gamification-roadmap.md#phase-4--e2e-и-гайд-по-игре-финал-v1) |
| 4.social | **Done (MVP)** — друзья по `friendCode` (#1492), заявки accept/decline, DM 1:1 (REST + poll 5 с в открытом чате), коллеги из общего workspace могут писать без дружбы |

**Суточный сброс:** cron `resetDailyTaskXpCounts` в `GamificationCronService` (00:00 `GAME_DAY_TZ`). Числа наград — `backend/src/gamification/config/rewards.ts`.

---

## Константы (синхронизировать backend ↔ frontend при изменении)

| Константа | Значение | Backend | Frontend |
|-----------|----------|---------|----------|
| XP за карточку | 100 | `gamification/config/rewards.ts` → `XP_PER_TASK_COMPLETED` | `lib/xpRewards.ts` |
| Дневной чекин | 100 | `XP_DAILY_CHECKIN` | `XP_DAILY_CHECKIN` |
| Лимит XP-тасков / сутки | 5 | `DAILY_TASK_XP_COMPLETIONS_MAX` в `character.service` | `DAILY_TASK_XP_COMPLETIONS_MAX` |
| HP за XP-событие | +5, max 100 | `HP_GAIN_PER_XP_EVENT` в `addExperience` | — |
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
| `DAILY_TASK_XP_LIMIT` | 409 | 6-я карточка с XP за игровые сутки |
| `XP_EVENT_ALREADY_RECORDED` | 409 | Повтор XP за ту же карточку (P2002) |
| `CHECKIN_ALREADY_DONE` | 409 | Повтор серии за тот же `dayKey` (P2002) |

**Фронт:** те же строки `code` в `frontend/src/shared/api/index.ts` → `API_ERROR_CODE_RU`; для «мягких» XP — `isXpGrantErrorCode` / `isXpTaskSoftNoticeCode`. Новый код → `throw` в сервисе + перевод в shared api + `@ApiResponse`.

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
│   ├── src/comment/comment.service.ts ← recordCommentCreated
│   └── src/card/card.module.ts        ← GamificationModule
│   ├── src/social/                    ← friends, DM, canMessage (friends | shared WS)
│   │   ├── social.service.ts
│   │   ├── social.controller.ts       ← /social/*
│   │   └── lib/friend-code.ts         ← 1000–9999, format #1492
├── frontend/
│   ├── src/ProfileCharacterPage.tsx   ← персонаж, streak, квесты
│   ├── src/ProfileCharacterQuestsPanel.tsx
│   ├── src/lib/quests.ts
│   ├── src/App.tsx                    ← intro-модалка после регистрации (portal, глобально)
│   ├── src/CharacterSetupPage.tsx     ← создание персонажа (без авто-редиректа)
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
│   ├── src/lib/chestAssets.ts         ← tap-кадры common (chests/common/0.png…4.png), иконка
│   ├── src/ChestIcon.tsx              ← иконка сундука в квестах
│   ├── src/ChestTapOpenModal.tsx      ← tap-to-open (Clash Royale), большой сундук
│   ├── src/lib/dustAssets.ts          ← dust/dust.png
│   ├── src/DustIcon.tsx               ← иконка пыли (24 / 48 px)
│   ├── src/lib/achievementAssets.ts   ← иконки achievements (unlocked / locked)
│   ├── src/lib/uiAssets.ts            ← UI-иконки геймификации (xp toast)
│   ├── src/lib/portraitLayout.ts      ← bbox/inset/классы (блок 2a assets)
│   ├── src/entities/social/           ← API, useMessagePolling (5 s)
│   ├── src/widgets/social-friends/    ← FriendsPanel
│   ├── src/widgets/social-messages/   ← MessagesPanel, ConversationView
│   └── src/lib/api.ts                 ← isXpGrantErrorCode, isXpTaskSoftNoticeCode
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

**Правила:** `Character.friendCode` при create; писать можно друзьям (`ACCEPTED`) или при общем workspace (`UserService.getProfileForViewer` логика). Коды: `MESSAGE_NOT_ALLOWED`, `FRIEND_CODE_NOT_FOUND`, … — `shared/api/api.ts`.

**Не в v1:** WebSocket, групповые чаты, блокировка, поиск по имени.

---

## Точка входа: начисление XP за карточку

1. `PATCH` закрытие карточки → `CardService.setCardCompletion`.
2. Только переход `isCompleted: false → true`.
3. `xpUserId = card.assigneeId ?? actorUserId`.
4. `addExperience` → `{ character, rewards }` (`taskXp`, `checkinXp`, `hpGained`, `checkinStreak`, `streakIncreased`); авто `DAILY_CHECKIN` при первом XP за день.
5. Ответ completion: `{ ok, rewards? }` → `RewardGrantToast` на доске (без кнопки «Отметиться»).
6. Ошибки XP **не откатывают** `isCompleted` — `isXpGrantErrorCode` / `isXpTaskSoftNoticeCode` в `api.ts`.

```typescript
// Инвариант: без персонажа у user — CHARACTER_NOT_FOUND, карточка уже completed
// Инвариант: повтор той же карточки — P2002 → XP_EVENT_ALREADY_RECORDED
// Инвариант: 6-й таск за «сутки» без сброса счётчика — DAILY_TASK_XP_LIMIT
```

---

## Паттерны при добавлении механик

1. **Сервер решает** — UI отображает состояние; полный текст правил в гайде — [Phase 4](gamification-roadmap.md#phase-4--e2e-и-гайд-по-игре-финал-v1).
2. **Идемпотентность** — unique в Prisma + `ConflictException` с `code`, не silent ignore.
3. **Транзакция** — XP + связанный прогресс (квест) в одном `prisma.$transaction`.
4. **Расширять `addExperience`** (или вынести `grantReward`) — не дублировать level-up/HP в card/comment сервисах.
5. **Ошибки XP** — в `character.service` (`{ code, message }`); фронт для «мягких» XP — `isXpTaskSoftNoticeCode` в `api.ts`.
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
| `ProfileCharacterPage` | Редактирование, streak; **полный гайд** — Phase 4 |
| `UserCharacterPage` | Просмотр чужого персонажа |
| `BoardPage` | XP toast при complete |

Показывать `dailyTaskXpCount` в UI опционально (поле уже в API `Character`). Статус HP=0 «истощён» — опционально, Phase 2+ / polish.

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
10. ~~**4a**~~ — done: полный гайд + `QUEST_MAGE_WOMAN` в луте/БД, валидация квестового образа.
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

## Связь с остальным приложением

Геймификация **не заменяет** workspace/board/card guards. Закрытие карточки по-прежнему через `CardService` + workspace membership. XP — побочный эффект успешного `setCardCompletion`; отсутствие персонажа у assignee не мешает закрыть карточку (ошибка только на grant XP).

Комментарии дают прогресс квеста `COMMENTS_CREATED`, но не XP. Пыль: `config/dust.ts`, `dust.service.ts`. Дубликат при открытии сундука — `DUST_FOR_DUPLICATE_BY_TIER`. Коды: `CHEST_*`, `COSMETIC_*`, `INSUFFICIENT_DUST` — `API_ERROR_CODE_RU`.

---

*Обновлять этот файл при каждой итерации по геймификации (статус фаз, очередь, баги UI).*
