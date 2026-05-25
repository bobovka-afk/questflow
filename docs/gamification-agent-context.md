# Questflow — контекст для AI-агента (геймификация)

Сжатая «память проекта» для итераций в Cursor: где код, какие инварианты, что делать следующим, что обновить после правок.

**Связанные документы:**

- [gamification-roadmap.md](gamification-roadmap.md) — продуктовый план, фазы, баланс, квесты, сундуки
- [README.md](../README.md) — обзор приложения


---

## Статус на момент документа

| Phase | Состояние |
|-------|-----------|
| 0 | **Done** — персонаж, XP за карточку, уровни, HP+5, UI |
| 0.5 | **Done** — cron сброс `dailyTaskXpCount`, `rewards.ts`, константы в сервисах |
| 1 | **In progress (1a–1b done, milestones 7/14/30, 1c UI)** — авто-серия, `CHECKIN_STREAK` XP, streak UI, intro |
| 2–3 | **Not started** — квесты, сундуки, dust |

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

`XpEvent.dayKey`: для `DAILY_CHECKIN` / `CHECKIN_STREAK` обязателен в `addExperience`; игровой день — `gamification/game-day.ts` + `GAME_DAY_TZ`.

---

## Константы, типы, ошибки

| Что | Где |
|-----|-----|
| Числа (XP, HP, лимиты) | `gamification/config/rewards.ts`, `config/checkin-streak-milestones.ts` |
| TZ, списки enum | `gamification/constants.ts` |
| Типы XP-транзакции | `gamification/interface/*.interface.ts` + `index.ts` |
| Ошибки API `{ code, message }` | **`character.service.ts`** — и CRUD персонажа, и XP/серия (приватные `throwXpEvent…`, без отдельной папки `errors/`) |

**Коды геймификации (в `character.service`):**

| code | HTTP | Когда |
|------|------|--------|
| `XP_EVENT_DAY_KEY_REQUIRED` | 400 | `DAILY_CHECKIN` / `CHECKIN_STREAK` без `dayKey` |
| `DAILY_TASK_XP_LIMIT` | 409 | 6-я карточка с XP за игровые сутки |
| `XP_EVENT_ALREADY_RECORDED` | 409 | Повтор XP за ту же карточку (P2002) |
| `CHECKIN_ALREADY_DONE` | 409 | Повтор серии за тот же `dayKey` (P2002) |

**Фронт:** те же строки `code` в `frontend/src/lib/api.ts` → `API_ERROR_CODE_RU`; для «мягких» XP — `isXpGrantErrorCode` / `isXpTaskSoftNoticeCode`. Новый код → `throw` в сервисе + перевод в `api.ts` + `@ApiResponse`.

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
│   │   ├── config/rewards.ts          ← XP/лимит/HP числа
│   │   ├── constants.ts               ← GAME_DAY_TZ default, dayKey types
│   │   ├── interface/                 ← типы XP-транзакции
│   │   ├── game-day.ts
│   │   ├── checkin-streak.ts
│   │   ├── inactivity.ts
│   │   └── gamification-cron.service.ts
│   ├── src/card/card.service.ts       ← setCardCompletion → { ok, rewards? }
│   └── src/card/card.module.ts        ← imports CharacterModule
├── frontend/
│   ├── src/ProfileCharacterPage.tsx   ← персонаж, streak 🔥, гайд
│   ├── src/App.tsx                    ← intro-модалка после регистрации (portal, глобально)
│   ├── src/CharacterSetupPage.tsx     ← создание персонажа (без авто-редиректа)
│   ├── src/GamificationIntroModal.tsx
│   ├── src/CheckinStreakCounter.tsx   ← счётчик серии + анимация roll
│   ├── src/RewardGrantToast.tsx       ← XP/чекин/HP/streak при закрытии карточки
│   ├── src/UserCharacterPage.tsx      ← чужой персонаж (read-only)
│   ├── src/BoardPage.tsx              ← парсит rewards с completion API
│   ├── src/lib/gamificationRewards.ts
│   ├── src/lib/gamificationIntro.ts   ← sessionStorage после register
│   ├── src/lib/xpRewards.ts           ← константы XP (должны = backend)
│   ├── src/lib/level-curve.ts         ← расчёт полоски XP
│   ├── src/lib/character.ts           ← CharacterDto, portrait URLs
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

**Запланировано:** `POST /character/checkin/weekly`, chest/inventory — см. [Phase 1–2 в roadmap](gamification-roadmap.md#phase-1--чекины-и-hp-cron).

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

1. **Сервер решает** — UI только отображает и дублирует константы/правила в гайде.
2. **Идемпотентность** — unique в Prisma + `ConflictException` с `code`, не silent ignore.
3. **Транзакция** — XP + связанный прогресс (квест) в одном `prisma.$transaction`.
4. **Расширять `addExperience`** (или вынести `grantReward`) — не дублировать level-up/HP в card/comment сервисах.
5. **Ошибки XP** — в `character.service` (`{ code, message }`); фронт для «мягких» XP — `isXpTaskSoftNoticeCode` в `api.ts`.
6. **Миграции** — `npx prisma migrate dev` в `backend/`; клиент: `src/generated/prisma`.
7. **После изменения чисел** — backend config + `frontend/src/lib/xpRewards.ts` + пункты в гайде `ProfileCharacterPage`.

---

## Backend (`backend/src/`)

### Unit-тесты (обязательно)

При изменении логики добавляй или обновляй **unit-тесты** (`*.spec.ts` рядом с модулем или в том же каталоге).

Покрывать реальное поведение: сервисы (`*.service.ts`), guards/filters/resolvers в `common/`, конфиг с логикой (`level-curve.ts`, `gamification/config/rewards.ts` и т.п.).

Паттерн: Jest, `createPrismaMock()` из `src/testing/prisma-mock.ts`, `new Service(mock)` без поднятия всего приложения.

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
| `ProfileCharacterPage` | Редактирование, **гайд обязателен** при новых правилах |
| `UserCharacterPage` | Просмотр чужого персонажа |
| `BoardPage` | XP toast при complete |

**Баг UI:** HP bar `style={{ width: '100%' }}` — должно быть `${character.health}%` (Phase 0.5/1).

Показывать `dailyTaskXpCount` в UI опционально (поле уже в API `Character`).

---

## Очередь задач для агента (рекомендуемый порядок)

1. ~~**0.5a**~~ — done: `@nestjs/schedule`, `GamificationModule`, cron `resetDailyTaskXpCounts()` в `GAME_DAY_TZ`.
2. ~~**0.5b**~~ — done: `rewards.ts`, без magic numbers в `character.service` / `card.service`.
3. ~~**0.5c**~~ — done: `GAME_DAY_TZ` в `.env.example`, unit-тесты cron.
4. ~~**1a**~~ — done: `addExperience` + `dayKey`, `game-day.ts`, `POST /character/checkin`.
5. ~~**1b**~~ — done: `HealthEvent`, `applyInactivityHpPenalty`, HP +5 в `addExperience`, grace 48h.
6. **1c** — UI чекин + fix HP bar + гайд.
7. **2+** — квесты по [Phase 2 в roadmap](gamification-roadmap.md#phase-2--квесты-и-сундуки-косметика).

После каждой фазы: обновить таблицу «Статус» в **этом файле**, [Known gaps](gamification-roadmap.md#known-gaps-критично-до-phase-1) и чеклисты Phase в roadmap.

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

- [ ] Константы совпадают backend ↔ `xpRewards.ts` ↔ гайд на `ProfileCharacterPage`
- [ ] Новый `code` в `character.service` + Swagger + `API_ERROR_CODE_RU` в `api.ts`
- [ ] Таблица «Статус» здесь и [Known gaps](gamification-roadmap.md#known-gaps-критично-до-phase-1) актуальны
- [ ] При новых таблицах — миграция + пример в Phase-чеклисте roadmap
- [ ] E2E/ручной сценарий: лимит 5, идемпотентность карточки, (позже) чекин, cron
- [ ] `cd backend && npm run test` проходит после изменений в `backend/src/`

---

## Связь с остальным приложением

Геймификация **не заменяет** workspace/board/card guards. Закрытие карточки по-прежнему через `CardService` + workspace membership. XP — побочный эффект успешного `setCardCompletion`; отсутствие персонажа у assignee не мешает закрыть карточку (ошибка только на grant XP).

Комментарии к карточкам пока **не** дают XP — задел под квест `COMMENTS_CREATED` (Phase 2).

---

*Обновлять этот файл при каждой итерации по геймификации (статус фаз, очередь, баги UI).*
