-- Replace CharacterAvatarPreset enum (8 generic -> 12 role/gender-specific values)

CREATE TYPE "CharacterAvatarPreset_new" AS ENUM (
  'DRUID_MAN',
  'HUNTER_MAN',
  'MAGE_MAN',
  'PALADIN_MAN',
  'ROGUE_MAN',
  'WARRIOR_MAN',
  'DRUID_WOMAN',
  'HUNTER_WOMAN',
  'MAGE_WOMAN',
  'PALADIN_WOMAN',
  'ROGUE_WOMAN',
  'WARRIOR_WOMAN'
);

ALTER TABLE "Character" ALTER COLUMN "avatar_preset" DROP DEFAULT;

ALTER TABLE "Character"
  ALTER COLUMN "avatar_preset" TYPE "CharacterAvatarPreset_new"
  USING (
    CASE "avatar_preset"::text
      WHEN 'AVATAR_01' THEN 'DRUID_MAN'::"CharacterAvatarPreset_new"
      WHEN 'AVATAR_02' THEN 'HUNTER_MAN'::"CharacterAvatarPreset_new"
      WHEN 'AVATAR_03' THEN 'MAGE_MAN'::"CharacterAvatarPreset_new"
      WHEN 'AVATAR_04' THEN 'PALADIN_MAN'::"CharacterAvatarPreset_new"
      WHEN 'AVATAR_05' THEN 'DRUID_WOMAN'::"CharacterAvatarPreset_new"
      WHEN 'AVATAR_06' THEN 'HUNTER_WOMAN'::"CharacterAvatarPreset_new"
      WHEN 'AVATAR_07' THEN 'MAGE_WOMAN'::"CharacterAvatarPreset_new"
      WHEN 'AVATAR_08' THEN 'PALADIN_WOMAN'::"CharacterAvatarPreset_new"
      ELSE 'DRUID_MAN'::"CharacterAvatarPreset_new"
    END
  );

DROP TYPE "CharacterAvatarPreset";

ALTER TYPE "CharacterAvatarPreset_new" RENAME TO "CharacterAvatarPreset";
