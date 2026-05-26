-- CreateEnum
CREATE TYPE "QuestPeriod" AS ENUM ('DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "QuestMetric" AS ENUM ('CARDS_COMPLETED', 'CARDS_COMPLETED_WITH_DUE_TODAY', 'COMMENTS_CREATED', 'DAILY_CHECKIN_DONE', 'ACTIVE_DAYS_WITH_XP', 'DISTINCT_WORKSPACES_ACTIVE');

-- CreateEnum
CREATE TYPE "ChestTier" AS ENUM ('COMMON', 'RARE', 'EPIC');

-- CreateEnum
CREATE TYPE "CosmeticType" AS ENUM ('AVATAR_PRESET', 'PORTRAIT_FRAME', 'PROFILE_BACKGROUND', 'TITLE_BADGE');

-- AlterTable
ALTER TABLE "Character" ADD COLUMN "equipped_portrait_frame_key" TEXT,
ADD COLUMN "equipped_profile_background_key" TEXT,
ADD COLUMN "equipped_title_badge_key" TEXT;

-- CreateTable
CREATE TABLE "QuestTemplate" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "period" "QuestPeriod" NOT NULL,
    "metric" "QuestMetric" NOT NULL,
    "target" INTEGER NOT NULL,
    "reward_chest_tier" "ChestTier" NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_ru" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "QuestTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuestProgress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "period_key" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "chest_id" INTEGER,

    CONSTRAINT "UserQuestProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChest" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tier" "ChestTier" NOT NULL,
    "source" TEXT NOT NULL,
    "opened_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CosmeticItem" (
    "id" SERIAL NOT NULL,
    "type" "CosmeticType" NOT NULL,
    "key" TEXT NOT NULL,
    "tier" "ChestTier" NOT NULL,
    "name_ru" TEXT NOT NULL,

    CONSTRAINT "CosmeticItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cosmetic_item_id" INTEGER NOT NULL,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "obtained_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuestXpDay" (
    "user_id" INTEGER NOT NULL,
    "day_key" DATE NOT NULL,

    CONSTRAINT "UserQuestXpDay_pkey" PRIMARY KEY ("user_id","day_key")
);

-- CreateTable
CREATE TABLE "UserWorkspaceQuestDay" (
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "day_key" DATE NOT NULL,

    CONSTRAINT "UserWorkspaceQuestDay_pkey" PRIMARY KEY ("user_id","workspace_id","day_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestTemplate_key_key" ON "QuestTemplate"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuestProgress_chest_id_key" ON "UserQuestProgress"("chest_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuestProgress_user_id_template_id_period_key_key" ON "UserQuestProgress"("user_id", "template_id", "period_key");

-- CreateIndex
CREATE UNIQUE INDEX "UserChest_user_id_source_key" ON "UserChest"("user_id", "source");

-- CreateIndex
CREATE UNIQUE INDEX "CosmeticItem_key_key" ON "CosmeticItem"("key");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_user_id_cosmetic_item_id_key" ON "InventoryItem"("user_id", "cosmetic_item_id");

-- AddForeignKey
ALTER TABLE "UserQuestProgress" ADD CONSTRAINT "UserQuestProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestProgress" ADD CONSTRAINT "UserQuestProgress_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "QuestTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestProgress" ADD CONSTRAINT "UserQuestProgress_chest_id_fkey" FOREIGN KEY ("chest_id") REFERENCES "UserChest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChest" ADD CONSTRAINT "UserChest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_cosmetic_item_id_fkey" FOREIGN KEY ("cosmetic_item_id") REFERENCES "CosmeticItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestXpDay" ADD CONSTRAINT "UserQuestXpDay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspaceQuestDay" ADD CONSTRAINT "UserWorkspaceQuestDay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed quest templates
INSERT INTO "QuestTemplate" ("key", "period", "metric", "target", "reward_chest_tier", "title_ru", "description_ru", "sort_order", "active") VALUES
('daily_cards_3', 'DAILY', 'CARDS_COMPLETED', 3, 'COMMON', 'Закрыть 3 карточки', 'Первое закрытие карточек, где вы исполнитель', 1, true),
('daily_due_today', 'DAILY', 'CARDS_COMPLETED_WITH_DUE_TODAY', 1, 'COMMON', 'Дедлайн сегодня', 'Закрыть карточку со сроком на сегодня', 2, true),
('daily_comment', 'DAILY', 'COMMENTS_CREATED', 1, 'COMMON', 'Комментарий', 'Оставить комментарий к карточке', 3, true),
('daily_checkin', 'DAILY', 'DAILY_CHECKIN_DONE', 1, 'COMMON', 'Серия за день', 'Получить опыт за игровой день (авто-чекин)', 4, true),
('weekly_cards_15', 'WEEKLY', 'CARDS_COMPLETED', 15, 'RARE', '15 карточек за неделю', NULL, 1, true),
('weekly_active_days', 'WEEKLY', 'ACTIVE_DAYS_WITH_XP', 5, 'RARE', '5 активных дней', 'Хотя бы одно XP-событие в день', 2, true),
('weekly_two_ws', 'WEEKLY', 'DISTINCT_WORKSPACES_ACTIVE', 2, 'RARE', '2 рабочих пространства', 'Закрыть карточку в двух разных WS за неделю', 3, true);

-- Seed cosmetics
INSERT INTO "CosmeticItem" ("type", "key", "tier", "name_ru") VALUES
('PORTRAIT_FRAME', 'frame_bronze', 'COMMON', 'Бронзовая рамка'),
('PORTRAIT_FRAME', 'frame_silver', 'COMMON', 'Серебряная рамка'),
('TITLE_BADGE', 'badge_starter', 'COMMON', 'Значок «Старт»'),
('PROFILE_BACKGROUND', 'bg_meadow', 'COMMON', 'Фон «Луг»'),
('PORTRAIT_FRAME', 'frame_gold', 'RARE', 'Золотая рамка'),
('PROFILE_BACKGROUND', 'bg_night', 'RARE', 'Фон «Ночь»'),
('TITLE_BADGE', 'badge_veteran', 'RARE', 'Значок «Ветеран»'),
('AVATAR_PRESET', 'QUEST_MAGE_MAN', 'RARE', 'Образ мага (квест)'),
('PORTRAIT_FRAME', 'frame_epic_flame', 'EPIC', 'Рамка пламени'),
('TITLE_BADGE', 'badge_legend', 'EPIC', 'Значок «Легенда»');
