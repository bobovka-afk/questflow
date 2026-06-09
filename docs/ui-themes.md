# Questflow — UI-темы (Pixel SNES)

Спецификация палитр и правил разблокировки для редизайна shell в стиле SNES pixel.

**Превью (локально):** `docs/design-previews/pixel-snes-themes.html`

**Связанные документы:**

- [gamification-agent-context.md](gamification-agent-context.md) — сундуки, loot table, косметика
- [gamification-assets.md](gamification-assets.md) — графические ассеты (рамки, фоны)
- [profile-settings-roadmap.md](profile-settings-roadmap.md) — настройки аккаунта (переключатель light/dark — кандидат в `/settings`)

---

## Принятые решения

| Решение | Значение |
|---------|----------|
| Layout shell | **Icon rail слева** (56px) — **реализовано** в `widgets/app-shell/` |
| Стиль | SNES pixel, VT323, inset-бордеры |
| Геймификация на boards home | **Нет** LV/XP/streak (только на `/profile/character`) |
| Тёмная тема по умолчанию | **#5 Slate Dungeon** (`theme_dark_slate`) — `PIXEL_THEME_DARK_SLATE` |
| Светлая тема по умолчанию | **#1 Parchment Quest** (`theme_light_parchment`) |
| Альтернативные палитры (обе стороны) | **Только из сундука** — см. раздел ниже |

---

## Доступность тем

### Бесплатно (старт)

| Ключ | Режим | Название |
|------|-------|----------|
| `theme_dark_slate` | dark | Slate Dungeon |
| `theme_light_parchment` | light | Parchment Quest |

Новый пользователь получает обе «базовые» темы сразу. В настройках выбирается **режим** (dark/light) и **палитра** внутри режима (если разблокирована).

### Из сундука (TODO — не в коде)

Темы **2–5** в каждом режиме — косметика, выпадающая из loot table сундуков (квест, магазин за пыль, рейд — **уточнить при внедрении**).

| Ключ | Режим | Название | № в превью |
|------|-------|----------|------------|
| `theme_dark_royal` | dark | Royal Purple | 1 |
| `theme_dark_forest` | dark | Forest Night | 2 |
| `theme_dark_crimson` | dark | Crimson Keep | 3 |
| `theme_dark_ocean` | dark | Deep Ocean | 4 |
| `theme_light_sky` | light | Sky Castle | 2 |
| `theme_light_meadow` | light | Meadow Day | 3 |
| `theme_light_rose` | light | Rose Quill | 4 |
| `theme_light_frost` | light | Frost Pixels | 5 |

**Правила:**

- Дубликат темы → пыль (как у рамок/фонов), сумма по tier — **TBD**.
- Базовые `theme_dark_royal` и `theme_light_parchment` **не добавлять** в loot table.
- При экипировке темы меняется CSS-набор токенов на `:root` / `[data-theme=…]`.
- Разблокированная тема другого режима (например, светлая из сундука при активной тёмной) видна в инвентаре, но применяется только после переключения режима или авто-переключения режима при equip — **TBD в UI**.

---

## Интеграция в дроп сундука (backlog)

> **Статус:** зафиксировано продуктово; в код не добавлено.

### Backend (черновик)

1. `CosmeticType` → добавить `APP_THEME` (или `UI_THEME`).
2. `CosmeticItem` seed: 8 записей (ключи из таблицы выше), `nameRu`, tier, иконка-превью (swatch PNG или CSS-only превью на фронте).
3. `loot-table.ts` / `boss-loot-table.ts` — веса для 8 тем (**TBD**, не смешивать dark/light в одном roll без явного дизайна).
4. `UserSettings` или `Character` — поля `equippedDarkThemeKey`, `equippedLightThemeKey` (или одно `equippedThemeKey` + `themeMode`).
5. PATCH equip + inventory UI как у рамок.

### Frontend (черновик)

1. `frontend/src/app/styles/tokens.css` — CSS variables по ключам тем.
2. Переключатель в `/settings` + превью в инвентаре после открытия сундука.
3. Карточка дропа в модалке сундука: название темы + 5–6 swatches.

### Loot table — место вставки

Файлы для правки при реализации:

- `backend/src/gamification/config/loot-table.ts` — common / rare / epic сундуки
- `backend/src/gamification/config/boss-loot-table.ts` — рейд (опционально)
- `backend/src/gamification/chest/chest.service.ts` — open flow без изменений, если тип косметики стандартный

---

## CSS-токены (имена для реализации)

Единый набор переменных для всех тем:

| Token | Назначение |
|-------|------------|
| `--px-bg` | Фон приложения |
| `--px-bg2` | Rail, topbar, кнопки |
| `--px-border` | Pixel border (чёрный / тёмно-коричневый) |
| `--px-accent` | Заголовки, активные акценты |
| `--px-text` | Основной текст |
| `--px-muted` | Вторичный текст |
| `--px-tile-1/2/3` | Плитки досок |
| `--px-green` | Аватар, success |
| `--px-rail-edge` | Inset rail |
| `--px-btn-edge` | Inset кнопок |
| `--px-logo-bg`, `--px-logo-shadow` | Логотип в rail |
| `--px-active-rail`, `--px-active-rail-text` | Активная вкладка rail |
| `--px-primary-bg`, `--px-primary-text` | Primary CTA |
| `--px-ghost-border`, `--px-tile-add-border` | Ghost / dashed |
| `--px-title-shadow` | text-shadow заголовка |
| `--px-inset-dark`, `--px-inset-light` | Inset плиток |

---

## Палитры (значения из превью)

### Тёмные

#### 1 · Royal Purple — **default dark** · `theme_dark_royal`

| Token | Value |
|-------|-------|
| bg | `#1a1033` |
| bg2 | `#2a1850` |
| border | `#000` |
| accent | `#ffe566` |
| text | `#f0e6d3` |
| muted | `#a898c8` |
| tile1/2/3 | `#4a6741` / `#5c4a8a` / `#8b4513` |
| green | `#6bcb77` |

#### 2 · Forest Night · `theme_dark_forest` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#0f1a14` / `#1a2e22` |
| accent | `#e8b84a` |
| text / muted | `#d8e8d0` / `#7a9a82` |
| tile1/2/3 | `#2d5a3d` / `#3a6b52` / `#6b4a2a` |

#### 3 · Crimson Keep · `theme_dark_crimson` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#1a0a10` / `#2e1420` |
| accent | `#f0c060` |
| text / muted | `#f0ddd8` / `#b08090` |
| tile1/2/3 | `#6b2030` / `#4a2848` / `#8b5020` |

#### 4 · Deep Ocean · `theme_dark_ocean` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#0a1428` / `#142040` |
| accent | `#ffd080` |
| text / muted | `#d0e0f0` / `#7090b8` |
| tile1/2/3 | `#1a5070` / `#284878` / `#3a6888` |

#### 5 · Slate Dungeon · `theme_dark_slate` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#141820` / `#222830` |
| accent | `#90c0ff` |
| text / muted | `#e0e4ec` / `#8898a8` |
| tile1/2/3 | `#3a4858` / `#4a5870` / `#586878` |

### Светлые

#### 1 · Parchment Quest — **default light** · `theme_light_parchment`

| Token | Value |
|-------|-------|
| bg / bg2 | `#f0e6d0` / `#e4d4b8` |
| border | `#2a2018` |
| accent | `#8b4513` |
| text / muted | `#2a2018` / `#7a6858` |
| tile1/2/3 | `#6b8c5a` / `#9a7a58` / `#b87840` |

#### 2 · Sky Castle · `theme_light_sky` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#e8f0f8` / `#d8e4f0` |
| border | `#1a2840` |
| accent | `#2858a8` |
| tile1/2/3 | `#4888c8` / `#6898d0` / `#90b8e0` |

#### 3 · Meadow Day · `theme_light_meadow` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#e8f0e0` / `#d8e8cc` |
| border | `#1a2818` |
| accent | `#c89818` |
| tile1/2/3 | `#5a9858` / `#78a868` / `#a8c878` |

#### 4 · Rose Quill · `theme_light_rose` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#f8ece8` / `#f0dcd4` |
| border | `#281820` |
| accent | `#a84858` |
| tile1/2/3 | `#c87888` / `#d898a0` / `#e8b8b0` |

#### 5 · Frost Pixels · `theme_light_frost` · **chest**

| Token | Value |
|-------|-------|
| bg / bg2 | `#e8ecef` / `#d8dfe4` |
| border | `#1a2028` |
| accent | `#4078a8` |
| tile1/2/3 | `#6888a0` / `#7898b0` / `#98b0c0` |

Полные значения вторичных токенов (rail-edge, primary, inset) — в `docs/design-previews/pixel-snes-themes.html` → объект `THEMES`.

---

## Очередь реализации

1. ~~**Сейчас:** внедрить layout + default dark/light в `tokens.css` / shell (без сундуков).~~ **Done (v1):** `pixel-shell.css`, `AppShell`, Royal + Parchment, rail: workspaces / character / notifications / messages / settings / theme / logout.
2. **Потом:** `APP_THEME` в Prisma, seed, loot table, UI инвентаря и settings.
3. **После стабилизации UI:** удалить `docs/design-previews/` или перенести swatch-иконки в `backend/uploads/ui/themes/`.
