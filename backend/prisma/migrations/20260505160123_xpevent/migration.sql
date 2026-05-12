/*
  Warnings:

  - You are about to drop the column `total_xp` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the `level_config` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "XpEventType" AS ENUM ('TASK_COMPLETED', 'DAILY_CHECKIN', 'CHECKIN_STREAK');

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "total_xp",
ADD COLUMN     "current_xp" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "level_config";

-- CreateTable
CREATE TABLE "XpEvent" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "XpEventType" NOT NULL,
    "card_id" INTEGER,
    "day_key" DATE,
    "xp_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "XpEvent_user_id_type_card_id_key" ON "XpEvent"("user_id", "type", "card_id");

-- CreateIndex
CREATE UNIQUE INDEX "XpEvent_user_id_type_day_key_key" ON "XpEvent"("user_id", "type", "day_key");

-- AddForeignKey
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
