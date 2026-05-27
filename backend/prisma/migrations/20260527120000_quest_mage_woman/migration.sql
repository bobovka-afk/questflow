ALTER TYPE "CharacterAvatarPreset" ADD VALUE 'QUEST_MAGE_MAN';
ALTER TYPE "CharacterAvatarPreset" ADD VALUE 'QUEST_MAGE_WOMAN';

INSERT INTO "CosmeticItem" ("type", "key", "tier", "name_ru")
VALUES ('AVATAR_PRESET', 'QUEST_MAGE_WOMAN', 'RARE', 'Образ мага (квест)')
ON CONFLICT ("key") DO NOTHING;
