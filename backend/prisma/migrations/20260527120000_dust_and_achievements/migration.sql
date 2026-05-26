-- CreateEnum
CREATE TYPE "AchievementMetric" AS ENUM ('CARDS_COMPLETED_TOTAL', 'COMMENTS_TOTAL', 'CHECKIN_STREAK_MAX', 'CHARACTER_LEVEL', 'QUESTS_COMPLETED_TOTAL', 'CHESTS_OPENED_TOTAL', 'DUST_EARNED_TOTAL', 'COSMETICS_OWNED_COUNT');

-- AlterTable
ALTER TABLE "Character" ADD COLUMN "dust" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AchievementTemplate" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "metric" "AchievementMetric" NOT NULL,
    "target" INTEGER NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_ru" TEXT,
    "reward_dust" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AchievementTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievementProgress" (
    "user_id" INTEGER NOT NULL,
    "metric" "AchievementMetric" NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserAchievementProgress_pkey" PRIMARY KEY ("user_id","metric")
);

-- CreateIndex
CREATE UNIQUE INDEX "AchievementTemplate_key_key" ON "AchievementTemplate"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_user_id_template_id_key" ON "UserAchievement"("user_id", "template_id");

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "AchievementTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievementProgress" ADD CONSTRAINT "UserAchievementProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed achievements
INSERT INTO "AchievementTemplate" ("key", "metric", "target", "title_ru", "description_ru", "reward_dust", "sort_order", "active") VALUES
('first_card', 'CARDS_COMPLETED_TOTAL', 1, 'Первая победа', 'Впервые закрыть карточку', 10, 1, true),
('cards_25', 'CARDS_COMPLETED_TOTAL', 25, 'Трудяга', 'Закрыть 25 карточек', 25, 2, true),
('cards_100', 'CARDS_COMPLETED_TOTAL', 100, 'Машина закрытий', 'Закрыть 100 карточек', 50, 3, true),
('first_comment', 'COMMENTS_TOTAL', 1, 'Голос команды', 'Оставить первый комментарий', 10, 4, true),
('comments_20', 'COMMENTS_TOTAL', 20, 'Обсуждатель', 'Оставить 20 комментариев', 20, 5, true),
('streak_7', 'CHECKIN_STREAK_MAX', 7, 'Неделя в строю', 'Серия за день: 7 дней подряд', 30, 6, true),
('streak_30', 'CHECKIN_STREAK_MAX', 30, 'Легенда серии', 'Серия за день: 30 дней подряд', 100, 7, true),
('level_5', 'CHARACTER_LEVEL', 5, 'Опытный герой', 'Достичь 5 уровня', 25, 8, true),
('level_10', 'CHARACTER_LEVEL', 10, 'Ветеран', 'Достичь 10 уровня', 50, 9, true),
('first_quest', 'QUESTS_COMPLETED_TOTAL', 1, 'Искатель', 'Выполнить первый квест', 15, 10, true),
('quests_20', 'QUESTS_COMPLETED_TOTAL', 20, 'Мастер квестов', 'Выполнить 20 квестов', 40, 11, true),
('first_chest', 'CHESTS_OPENED_TOTAL', 1, 'Вскрыватель', 'Открыть первый сундук', 10, 12, true),
('chests_10', 'CHESTS_OPENED_TOTAL', 10, 'Кладоискатель', 'Открыть 10 сундуков', 35, 13, true),
('dust_100', 'DUST_EARNED_TOTAL', 100, 'Собиратель пыли', 'Получить 100 пыли за дубликаты', 0, 14, true),
('cosmetics_5', 'COSMETICS_OWNED_COUNT', 5, 'Коллекционер', 'Иметь 5 предметов косметики', 30, 15, true);
