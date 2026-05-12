-- AlterTable
ALTER TABLE "Character" DROP COLUMN IF EXISTS "skin_color";

-- DropEnum
DROP TYPE IF EXISTS "SkinColorPreset";
