# Questflow — дорожная карта геймификации

docker compose up -d --build postgres redis app frontend

Документ для продукта и разработки: что уже сделано, куда движемся, обязательные принципы и черновые числа баланса. Сервер — источник истины; все начисления должны быть идемпотентны и аудируемы в PostgreSQL.

**Связанные файлы:** [README.md](../README.md), [gamification-agent-context.md](gamification-agent-context.md) (контекст для AI), [profile-settings-roadmap.md](profile-settings-roadmap.md) (аккаунт и `/settings`, не RPG), [backend/prisma/schema.prisma](../backend/prisma/schema.prisma), [backend/src/character/](../backend/src/character/), [frontend/src/pages/profile-character/ProfileCharacterPage.tsx](../frontend/src/pages/profile-character/ProfileCharacterPage.tsx).

> **Для AI-агента:** перед задачей по геймификации читай [gamification-agent-context.md](gamification-agent-context.md). Не использовать `GAMIFICATION_ROADMAP (1).md` в корне — устаревший черновик.

---

## Ключевые решения (зафиксировано)

1. **Сначала починить суточный сброс** `dailyTaskXpCount` — без midnight job лимит «5 XP за карточки в день» перестаёт работать после первых пяти закрытий.
2. **Разделить XP и HP:** XP — долгий уровень; HP — ежедневная дисциплина (штраф за бездействие, восстановление через действия с наградой).
3. **Персонаж один на аккаунт;** прогресс учитывает активность в **любом** воркспейсе.
4. **Сундуки v1 — только косметика,** без статов и влияния на XP/HP (нет pay-to-win).
5. **Квесты выдают сундук (токен),** открытие сундука — отдельный момент награды (variable reward).
6. В фазах 0–3 — только минимальные подсказки в UI при необходимости; **полный** гайд «Как это работает» и **E2E** — в финальной [Phase 4](#phase-4--e2e-и-гайд-по-игре-финал-v1).

---

## Цели и принципы

| Принцип | Описание |
|---------|----------|
| Над задачами, не вместо | Доски и карточки остаются ядром; геймификация мотивирует закрывать работу, а не блокирует её. |
| Один персонаж | `Character.userId` уникален; квесты и XP агрегируют действия пользователя по всем workspace. |
| Прозрачность | Правила и лимиты видны в профиле персонажа и в Swagger; неожиданных штрафов без предупреждения в UI избегать. |
| Аудит | `XpEvent` (и позже `HealthEvent`) — журнал начислений; unique constraints против дублей. |
| Мягкие потери | HP=0 — косметический статус, **без** блокировки досок и карточек. |
| Анти-фарм | Дневные лимиты, уникальность событий по `cardId` / `dayKey`. |

---

## Phase 0 — реализовано сейчас

| Область | Статус | Где в коде |
|---------|--------|------------|
| Персонаж (CRUD) | Готово | `backend/src/character/`, `POST/GET/PATCH /character` |
| Аватары | 12 preset (пол × класс) | `CharacterAvatarPreset` в Prisma |
| XP за первое закрытие карточки | +100 XP | `card.service.ts` → `characterService.addExperience` |
| Получатель XP | Исполнитель карточки, иначе тот, кто закрыл | `assigneeId ?? actorUserId` |
| Повторное закрытие | Без XP | unique `(userId, TASK_COMPLETED, cardId)` |
| Лимит XP за таски | max 5/сутки на персонажа | `dailyTaskXpCount`, `DAILY_TASK_XP_LIMIT` |
| Уровни | 1–100, кривая XP | `backend/src/character/config/level-curve.ts` |
| HP при награде XP | +5, max 100 | `CharacterService.addHealth()` |
| UI персонажа | Уровень, XP bar, HP, гайд | `frontend/src/pages/profile-character/ProfileCharacterPage.tsx` |

### Поток начисления (сейчас)

```mermaid
flowchart LR
  CardComplete[Card marked completed]
  AddXP[addExperience]
  XpEvent[XpEvent row]
  Char[Character XP level HP]
  CardComplete --> AddXP --> XpEvent --> Char
```

### XpEventType (Phase 1)

- `TASK_COMPLETED` — используется.
- `DAILY_CHECKIN` — **реализовано** (авто при первом XP за день + `POST /character/checkin`).
- `CHECKIN_STREAK` — **реализовано** (пороги 7 / 14 / 30).

---

## Known gaps (история; Phase 1 закрыта)

| Проблема | Статус |
|----------|--------|
| ~~`dailyTaskXpCount` не сбрасывается~~ | **Fixed (0.5a)** — cron в `GAME_DAY_TZ` |
| ~~Нет HP decay~~ | **Fixed (1b)** — `HealthEvent` + cron |
| ~~Нет чекинов~~ | **Fixed (1a)** |
| ~~Нет `@nestjs/schedule`~~ | **Fixed (0.5a)** |
| ~~HP bar в UI~~ | **Fixed (1c)** — width от `health` |
| HP = 0, косметический статус в UI | **Backlog** — не блокирует доски |
| Недельный чекин | **Optional** — можно объединить с weekly-квестами (Phase 2) |

---

## Столпы геймификации (обязательные)

Кратко: зачем столп и как он ложится на Questflow.

| Столп | Зачем | У нас |
|-------|-------|-------|
| **Clear goals** | Пользователь знает, что сделать сегодня | Дневные/недельные квесты; лимит 5 XP-тасков; чекин |
| **Feedback** | Действие сразу подкреплено | Toast/+XP при закрытии карточки; обновление профиля |
| **Progression** | Долгая мотивация | Уровни 1–100; коллекция косметики из сундуков |
| **Loss aversion (мягкая)** | Не бросать ритм | HP decay за день без активности; восстановление тасками/чекином |
| **Streaks** | Привычка заходить | Серия дневных чекинов + бонусы `CHECKIN_STREAK` |
| **Fair limits** | Нет бесконечного фарма | 5 XP/день за карточки; unique на события |
| **Autonomy** | Работа не наказывается | После лимита карточки закрываются без XP |
| **Social** (позже) | Команда | Лидерборд workspace — не v1 |

### Чего избегать

- Pay-to-win и статы на снаряжении в v1.
- Непрозрачные штрафы HP без текста в гайде.
- Разные определения «суток» в коде и в UI без `GAME_DAY_TZ` в документации.
- Блокировка Trello-функций при HP=0 или низком уровне.

---

## Экономика XP и HP

Единый конфиг (целевое расположение): `backend/src/gamification/config/rewards.ts` + зеркало `frontend/src/entities/reward/lib/xpRewards.ts`.

### XP

| Событие | XP | Лимит | Статус |
|---------|-----|-------|--------|
| Первое закрытие карточки | 100 | 5 раз / игровые сутки | **Реализовано** |
| Дневной чекин | 100 | 1 / сутки | **Реализовано (1a)** — `POST /character/checkin` |
| Недельный чекин | 200 | 1 / неделя (periodKey) | Planned |
| Streak 7 / 14 / 30 дней | 200 / 400 / 800 | Раз за milestone | **Реализовано (1)** — `CHECKIN_STREAK` |

**Игровые сутки:** граница по `GAME_DAY_TZ` (рекомендация: `Europe/Moscow` или `UTC`, одно значение в `.env`).

### HP

| Правило | Значение | Статус |
|---------|----------|--------|
| Максимум | 100 | Реализовано |
| За любое XP-событие с начислением | +5 | **Реализовано (1b)** в `addExperience` |
| Штраф за вчера без активности | −5 | **Реализовано (1b)** — cron `applyInactivityHpPenalty` |
| HP = 0 | Статус «истощён», доски не блокируются | Backlog (UI), механика есть |

### Активность (для HP decay) — черновое правило

За **вчера** (календарный день в `GAME_DAY_TZ`) пользователь **активен**, если выполнено **хотя бы одно**:

1. Есть запись в `XpEvent` для `userId` за этот `dayKey`, **или**
2. Пользователь **первый раз** перевёл карточку в `isCompleted=true` в этот день (как assignee или как actor при закрытии — уточнить в Phase 1; рекомендация: засчитывать оба случая через audit поле `completedByUserId` на карточке или отдельную таблицу событий).

Если не активен → cron снимает 5 HP (идемпотентно: не штрафовать дважды за один `dayKey`).

**Grace period:** новый персонаж / аккаунт — без HP-штрафа первые 24 часа.

---

## Цикл «игрового дня» пользователя (целевой)

```mermaid
flowchart TB
  subgraph day [Game day GAME_DAY_TZ]
    Tasks[Close cards up to 5 XP]
    Checkin[Daily checkin]
    Quests[Daily weekly quests]
    Tasks --> XpAndHp[+XP and +5 HP]
    Checkin --> XpAndHp
    Quests --> ChestToken[Chest token]
  end
  subgraph night [Midnight cron]
    ResetLimit[Reset dailyTaskXpCount]
    HpDecay[HP -5 if yesterday inactive]
    ResetLimit --> NextDay[Next game day]
    HpDecay --> NextDay
  end
  day --> night
  ChestToken --> OpenChest[Open chest cosmetic]
```

---

## Phase 0.5 — сброс суток и константы — **Done**

**Deliverables:**

- [x] `@nestjs/schedule`, `GamificationCronService`.
- [x] Job `0 0 * * *` (в `GAME_DAY_TZ`): сброс `dailyTaskXpCount`.
- [x] `backend/src/gamification/config/rewards.ts`; `character.service` / `card.service` без magic numbers.
- [x] `GAME_DAY_TZ` в `.env.example`; unit-тесты cron и `rewards`.

**Зависимости:** нет (блокер для честного лимита 5/день снят).

---

## Phase 1 — чекины и HP cron — **Done**

### Дневной / недельный чекин

| Endpoint | Назначение |
|----------|------------|
| `POST /character/checkin` | Дневной чекин, `DAILY_CHECKIN`, `dayKey = today` |
| `POST /character/checkin/weekly` | Опционально; `dayKey` = начало ISO-недели |

**Логика:**

- `addExperience(userId, 100, DAILY_CHECKIN, null)` с `dayKey` (кнопка или авто при первом XP за сутки, напр. карточка).
- Авто-чекин: первое XP-действие за день → +100 чекин **без HP**; карточка → +100 XP и +5 HP.
- При конфликте unique → `409 CHECKIN_ALREADY_DONE`.
- Streak: поля `checkinStreak`, `lastCheckinDay` на `Character` **или** вычисление из `XpEvent` (в MD рекомендуем поля на Character для быстрого UI).
- Milestone streak → `CHECKIN_STREAK` с синтетическим `dayKey` (идемпотентность по порогу 7/14/30): `gamification/config/checkin-streak-milestones.ts`, `checkin-streak-milestones.ts`.

**UI:** индикатор серии, toast при наградах (авто-чекин без отдельной кнопки). Текст правил в гайде — [Phase 4](#phase-4--e2e-и-гайд-по-игре-финал-v1).

### HP decay cron

**Сервис:** `GamificationCronService.applyInactivityHpPenalty()`.

**Алгоритм:**

1. Выбрать персонажей с `health > 0`, не в grace period.
2. Для `yesterday` проверить активность (см. выше).
3. Если неактивен и нет `HealthEvent` за `(userId, dayKey)` → `health -= 5`, запись audit.
4. Идемпотентность: unique `(userId, dayKey)` на `HealthEvent`.

**Модель audit (концепт):**

```prisma
model HealthEvent {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  dayKey    DateTime @db.Date
  delta     Int      // negative for penalty
  reason    String   // INACTIVITY_PENALTY | XP_REWARD_SYNC
  createdAt DateTime @default(now())

  @@unique([userId, dayKey, reason])
}
```

### Phase 1 — чеклист разработки

- [x] Миграция: `checkinStreak`, `lastCheckinDayKey`.
- [x] Пороги серии 7 / 14 / 30 → `CHECKIN_STREAK` (+200 / +400 / +800 XP), `streakMilestonesReached` в `rewards`.
- [x] `HealthEvent` + миграция `20260525103000_health_event`.
- [x] Check-in controller + Swagger (`POST /character/checkin`, 1a).
- [x] Cron HP penalty + `GAME_DAY_TZ` (в одном midnight job с reset XP).
- [x] HP +5 в `addExperience` (1b).
- [x] Frontend (1c): streak, HP bar по `health`, intro/toast, модалка (i) с порогами 7/14/30 (без полного гайда — Phase 4).

**Не в scope Phase 1 (перенесено):** полный гайд и E2E → Phase 4; недельный чекин → optional / Phase 2.

---

## Phase 2 — квесты и сундуки (косметика)

Фаза делится на две стадии: сначала **движок квестов** (2a), затем **награды-сундуки** (2b). UI гайда по квестам — в Phase 4 вместе с остальными правилами.

### Phase 2a — квесты (quest engine)

**Цель:** ежедневные и недельные задания с прогрессом по действиям в любом workspace; награда — токен сундука (выдача сундука в 2b).

| Задача | Описание |
|--------|----------|
| Prisma | `QuestTemplate`, `UserQuestProgress`, enums `QuestPeriod`, `QuestMetric` |
| Сиды / админ | Шаблоны: 3–4 дневных, 2–3 недельных (см. таблицы ниже) |
| Quest service | `periodKey` в `GAME_DAY_TZ`, инкремент `current`, `completedAt` |
| Hooks | После закрытия карточки, комментария, авто-чекина — в той же `$transaction`, где XP |
| API | `GET /character/quests` (активные + прогресс), опционально claim bundle |
| Идемпотентность | Unique `(userId, templateId, periodKey)`; повторное событие не дублирует прогресс сверх target |
| UI (минимум) | Список квестов на профиле / виджет; детали в Phase 4 |

**Дневные примеры:** 3 карточки, 1 с дедлайном сегодня, 1 комментарий, чекин за день.

**Недельные примеры:** 15 карточек, 5 дней с XP, 2 workspace с активностью.

**Чеклист 2a:**

- [x] Миграция QuestTemplate + UserQuestProgress
- [x] GamificationModule: `QuestProgressService` + unit-тесты (`quest-period`, `quest-progress`)
- [x] Hook из `CardService`, `CommentService`, `CharacterService` (checkin / XP day)
- [x] `GET /character/quests` + Swagger
- [x] Frontend: блок «Квесты дня / недели» на `ProfileCharacterPage`

### Phase 2b — сундуки и косметика

**Цель:** variable reward — сундук за выполненный набор квестов; открытие → косметика в инвентарь; **без статов и влияния на XP/HP**.

| Задача | Описание |
|--------|----------|
| Prisma | `CosmeticItem`, `UserChest`, `InventoryItem`, `ChestTier`, loot table (конфиг или таблица) |
| Выдача сундука | **За каждый выполненный квест** — свой `UserChest` (tier из шаблона); `source` = `QUEST:{templateId}:{periodKey}`; бонус 7/7 чекинов → Epic (опц., отдельный source) |
| API | `POST /character/chests/:id/open`, `GET /character/inventory`, `PATCH /character/cosmetics/equip` |
| Дубликат | Phase 2: сообщение «уже есть»; Phase 3: пыль (dust) |
| UI | Неполученные сундуки, анимация открытия, экипировка рамки/фона/badge; preset — через `updateCharacter` + проверка владения |
| Ошибки | `CHEST_ALREADY_OPENED`, `COSMETIC_NOT_OWNED` (см. технический чеклист) |

**Чеклист 2b:**

- [x] Миграция cosmetic + chest + inventory
- [x] Loot roll (weighted), запись `InventoryItem`
- [x] Open chest + equip endpoints + Swagger
- [x] Связка: завершение квеста → `ChestService.grant` (per-quest)
- [x] Frontend: квесты, открытие сундука, экипировка косметики на профиле

**Зависимости:** 2b требует 2a (сундук выдаётся за квесты). Можно параллелить Prisma-черновик 2b с концом 2a.

### Модель данных (черновик)

```prisma
enum QuestPeriod {
  DAILY
  WEEKLY
}

enum QuestMetric {
  CARDS_COMPLETED
  CARDS_COMPLETED_WITH_DUE_TODAY
  COMMENTS_CREATED
  DAILY_CHECKIN_DONE
  ACTIVE_DAYS_WITH_XP
  DISTINCT_WORKSPACES_ACTIVE
}

model QuestTemplate {
  id            Int         @id @default(autoincrement())
  period        QuestPeriod
  metric        QuestMetric
  target        Int
  rewardChestTier ChestTier
  active        Boolean     @default(true)
}

model UserQuestProgress {
  id           Int      @id @default(autoincrement())
  userId       Int
  templateId   Int
  periodKey    String   // "2026-05-25" or "2026-W21"
  current      Int      @default(0)
  completedAt  DateTime?

  @@unique([userId, templateId, periodKey])
}

enum ChestTier {
  COMMON
  RARE
  EPIC
}

enum CosmeticType {
  AVATAR_PRESET
  PORTRAIT_FRAME
  PROFILE_BACKGROUND
  TITLE_BADGE
}

model CosmeticItem {
  id       Int          @id @default(autoincrement())
  type     CosmeticType
  key      String       @unique
  tier     ChestTier
}

model UserChest {
  id        Int       @id @default(autoincrement())
  userId    Int
  tier      ChestTier
  source    String    // QUEST_DAILY_BUNDLE, QUEST_WEEKLY_ALL
  openedAt  DateTime?
  createdAt DateTime  @default(now())
}

model InventoryItem {
  id              Int      @id @default(autoincrement())
  userId          Int
  cosmeticItemId  Int
  equipped        Boolean  @default(false)
  obtainedAt      DateTime @default(now())

  @@unique([userId, cosmeticItemId])
}
```

### Примеры квестов (rule-based)

**Дневные (pool, 3–4 активных в день):**

| Квест | Метрика | Target |
|-------|---------|--------|
| Закрыть 3 карточки | `CARDS_COMPLETED` | 3 |
| Закрыть карточку с дедлайном сегодня | `CARDS_COMPLETED_WITH_DUE_TODAY` | 1 |
| Оставить комментарий | `COMMENTS_CREATED` | 1 |
| Дневной чекин | `DAILY_CHECKIN_DONE` | 1 |

**Награда (v1):** **отдельный сундук за каждый выполненный квест** — `rewardChestTier` в шаблоне (Common для дневных, Rare для недельных). Зачёт карточек — **исполнителю** (`assigneeId ?? actor`), как XP.

**Недельные:**

| Квест | Метрика | Target |
|-------|---------|--------|
| Закрыть 15 карточек | `CARDS_COMPLETED` | 15 |
| 5 дней с ≥1 XP-событием | `ACTIVE_DAYS_WITH_XP` | 5 |
| Активность в 2 воркспейсах | `DISTINCT_WORKSPACES_ACTIVE` | 2 |

**Награда:** сундук **Rare за каждый** недельный квест; бонус 7/7 чекинов за неделю → **Epic** (опционально, отдельный `source`).

### Сундуки v1 — только косметика

| Tier | Источник | Содержимое (примеры) |
|------|----------|----------------------|
| Common | Каждый дневной квест | Рамка, badge, фон (duplicate → Phase 3 dust) |
| Rare | Каждый недельный квест | Avatar preset, фон профиля |
| Epic | Streak / особое недельное | Эксклюзивный preset / рамка |

**Открытие:** `POST /character/chests/:id/open` → weighted roll по `LootTable` → `InventoryItem`. Дубликат: в Phase 3 конвертация в «пыль»; в Phase 2 — сообщение «уже есть» без ломания UX.

**Экипировка:** `PATCH /character/cosmetics/equip` — рамка, фон, title; avatar preset остаётся в существующем `updateCharacter` с проверкой владения.

### Quest engine (поведение)

- Прогресс обновляется в тех же транзакциях, где карточка закрыта / комментарий создан / чекин (hook из сервисов, не только cron).
- `periodKey` пересчитывается в `GAME_DAY_TZ`.
- Завершение квеста → создать `UserChest` (unique `userId` + `source` = `QUEST:{templateId}:{periodKey}`).

---

## Phase 3 — пыль и достижения

| Идея | Статус | Описание |
|------|--------|----------|
| Пыль (dust) | **Done** | Дубликат косметики → пыль по tier предмета (15/40/100); магазин: 3 сундука (50/120/250 пыли) |
| Achievements | **Done** | 15 one-time ачивок, прогресс по метрикам, бонусная пыль за разблокировку |
| Battle pass | → Phase 4 backlog | 4-недельный сезон с треком наград |
| Уведомления | → Phase 4 backlog | Email / in-app |
| Лидерборд workspace | → Phase 4 backlog | Топ по XP за неделю (opt-in) |
| Командные weekly goals | → Phase 4 backlog | Общий прогресс WS |

**API:** `GET /character/achievements`, `GET /character/dust/shop`, `POST /character/dust/purchase` (`{ tier }`). Поле `Character.dust`. Коды: `INSUFFICIENT_DUST`, `DUST_SHOP_TIER_INVALID`.

---

## Phase 4.social — Друзья и личные сообщения (MVP) — **Done**

| Что | Реализация |
|-----|-------------|
| Friend code | `Character.friendCode` 1000–9999, UI `#1492`, уникальный при create |
| Заявки | PENDING → ACCEPTED / DECLINED; добавление только по коду |
| DM | `DirectMessage`, REST; poll `GET .../messages/with/:id?since=` каждые 5 с в открытом чате |
| Кому писать | Друзья или общий workspace (как `getProfileForViewer`) |
| UI | Вкладки «Друзья» / «Сообщения» на `ProfileCharacterPage`; кнопки на `UserCharacterPage` |

**Не в v1:** WebSocket, групповые чаты, блокировка, поиск по имени персонажа.

---

## Phase 5.party — рейд-боссы с друзьями (v1)

| Что | Решение |
|-----|---------|
| Пати | 2–8 друзей; инвайт только из списка друзей (`ACCEPTED`) |
| Рейдов на игрока | 1 в статусе `INVITING` или `ACTIVE` |
| HP босса | 0–100 %; kill при `remainingPct ≤ 0` |
| Время kill | ~2.5–3 дня при полной активности (бюджет **40 %/сутки** на пати) |
| Урон за удар | `BOSS_DAILY_PARTY_BUDGET_PCT / (activeMembers × 5)` |
| Мана | cap **100**; **+5** только там же, где XP за карточку; атака **−5** |
| Kick | лидер вручную **или** голосование большинством активных |
| После kick | `activeMembers` ↓ → урон/удар ↑; % HP босса не откатывается |
| Награда | Boss chest по tier босса; `contributionPct ≥ 5%`; kicked — без сундука |
| Боссы (v1) | 3 шаблона в `party/config/boss-templates.ts` |

**Отложено:** авто-кик 2 дня AFK, второй параллельный рейд, пати >8, отдельные loot tables на босса.

---

## Phase 4 — E2E и гайд по игре (финал v1)

**Когда:** после завершения механик Phase 0–2 (и опционально выбранных пунктов Phase 3). Не блокирует разработку фич — сводит правила и регрессию в одном месте.

### Гайд «Как это работает»

- [x] Актуальный полный текст в `ProfileCharacterPage` («Как это работает»): XP за карточки, лимит 5/сутки, авто-чекин и серия, milestones, HP (+5 за награду, −5 за бездействие), grace, `GAME_DAY_TZ`.
- [x] После Phase 2 — квесты, сундуки, косметика (без pay-to-win).
- [x] Константы в тексте = `xpRewards.ts` / `rewards.ts`; intro (`GamificationIntroModal`) не противоречит гайду.

### E2E / regression

- [ ] Сброс `dailyTaskXpCount`: после полуночи снова до 5 XP за карточки.
- [ ] Идемпотентность: повторное закрытие той же карточки, лимит 5 за сутки.
- [ ] Чекин: двойной запрос / авто-чекин при первом XP, milestones 7/14/30.
- [ ] HP: штраф за вчера только раз, grace period, +5 при XP-событии.
- [ ] (Phase 4 E2E) квесты → сундук → открытие, дубликат косметики.

**Где:** Playwright/Cypress или согласованный manual regression-чеклист в репо; unit-тесты cron/сервисов остаются в фазах 0.5–1.

---

## Roadmap по фазам (для агента)

| Phase | Deliverable | Зависимости |
|-------|-------------|-------------|
| **0** | Персонаж, XP за карточки, уровни, HP+5 | — |
| **0.5** | Сброс `dailyTaskXpCount`, `rewards.ts` | schedule |
| **1** | Чекины, HP cron, streak UI | **Done** |
| **2a** | Quest templates + progress hooks | Phase 1, card/comment/checkin |
| **2b** | Chests, inventory, equip cosmetic | Phase 2a |
| **3** | Dust, achievements, notifications | optional |
| **4.social** | Друзья, DM | **Done** |
| **5.party** | Party boss raids, мана, kick | Phase 4.social |
| **4** | E2E regression, полный гайд по игре | Phase 0–2 (механики) |

---

## Технический чеклист

- [ ] **Идемпотентность:** unique на `(userId, type, cardId)` и `(userId, type, dayKey)`; то же для HP penalty.
- [ ] **Транзакции:** `addExperience` + quest progress + chest grant в `$transaction` где связано.
- [ ] **Логи:** Pino — `userId`, `eventType`, `xpAmount`, `questId`, `chestId`.
- [ ] **Конфиг:** один `rewards.ts`, без магических чисел в сервисах.
- [ ] **Unit-тесты** (в фазах фич): лимит 5, повтор карточки, cron, grace HP — `*.spec.ts`.
- [ ] **E2E и полный гайд** — только [Phase 4](#phase-4--e2e-и-гайд-по-игре-финал-v1).
- [ ] **Frontend:** константы из `xpRewards.ts` синхронно с backend; текст гайда — Phase 4.
- [ ] **Swagger:** все новые эндпоинты с кодами ошибок (`DAILY_TASK_XP_LIMIT`, `XP_EVENT_ALREADY_RECORDED`, …).

### Коды ошибок (расширение)

| Code | Когда |
|------|-------|
| `DAILY_TASK_XP_LIMIT` | 5 XP за карточки исчерпаны |
| `XP_EVENT_ALREADY_RECORDED` | Повторное событие |
| `CHECKIN_ALREADY_DONE` | Чекин за сегодня |
| `CHEST_ALREADY_OPENED` | Повторное открытие |
| `COSMETIC_NOT_OWNED` | Экипировка без inventory |

---

## Открытые решения (обсудить перед кодом)

| # | Вопрос | Варианты | Рекомендация |
|---|--------|----------|--------------|
| 1 | TZ суток | UTC / `Europe/Moscow` / per-user | Один `GAME_DAY_TZ` в env, документировать в UI |
| 2 | Активность для HP | Только `XpEvent` / любое закрытие карточки / логин | XP или закрытие карточки (ближе к «работе») |
| 3 | Предупреждение HP | Тихий штраф / баннер «завтра −5» | Баннер в профиле если вчера уже неактивен сегодня |
| 4 | Weekly check-in | Отдельная кнопка / только weekly quests | Объединить с weekly quest bundle |
| 5 | Кто закрыл карточку | Только assignee XP / actor при отсутствии assignee | Текущее поведение сохранить |
| 6 | Недельный periodKey | ISO week / скользящие 7 дней | ISO week в `GAME_DAY_TZ` |

---

## Ссылки на реализацию Phase 0

| Файл | Назначение |
|------|------------|
| [backend/src/character/character.service.ts](../backend/src/character/character.service.ts) | `addExperience`, HP, лимит 5 |
| [backend/src/card/card.service.ts](../backend/src/card/card.service.ts) | Начисление при `setCardCompletion` |
| [backend/src/gamification/config/rewards.ts](../backend/src/gamification/config/rewards.ts) | XP за таск, дневной лимит, HP-константы |
| [backend/src/character/config/level-curve.ts](../backend/src/character/config/level-curve.ts) | Кривая уровней |
| [backend/prisma/schema.prisma](../backend/prisma/schema.prisma) | `Character`, `XpEvent`, enums |
| [frontend/src/entities/reward/lib/xpRewards.ts](../frontend/src/entities/reward/lib/xpRewards.ts) | Константы для UI |
| [frontend/src/pages/profile-character/ProfileCharacterPage.tsx](../frontend/src/pages/profile-character/ProfileCharacterPage.tsx) | Отображение и гайд |

---

*Продуктовый roadmap. Контекст для агента: [gamification-agent-context.md](gamification-agent-context.md). При фазах обновлять оба файла + Known gaps и таблицы XP/HP.*
