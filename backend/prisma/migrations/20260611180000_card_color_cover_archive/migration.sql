-- CreateEnum
CREATE TYPE "CardCoverDisplayMode" AS ENUM ('NONE', 'BANNER', 'FULL');

-- AlterTable
ALTER TABLE "Card"
ADD COLUMN "cover_color_preset" "ListColorPreset",
ADD COLUMN "cover_display_mode" "CardCoverDisplayMode" NOT NULL DEFAULT 'NONE',
ADD COLUMN "archived_at" TIMESTAMP(3);
