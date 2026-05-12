-- CreateEnum
CREATE TYPE "CharacterAvatarPreset" AS ENUM (
  'AVATAR_01',
  'AVATAR_02',
  'AVATAR_03',
  'AVATAR_04',
  'AVATAR_05',
  'AVATAR_06',
  'AVATAR_07',
  'AVATAR_08'
);

-- AlterTable
ALTER TABLE "Character" ADD COLUMN "avatar_preset" "CharacterAvatarPreset" NOT NULL DEFAULT 'AVATAR_01';

ALTER TABLE "Character" ALTER COLUMN "avatar_preset" DROP DEFAULT;
