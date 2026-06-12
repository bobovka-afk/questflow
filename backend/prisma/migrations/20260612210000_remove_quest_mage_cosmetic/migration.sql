-- Квестовый образ мага: нет ассетов, убран из лута и инвентаря.
UPDATE "Character"
SET "avatar_preset" = 'MAGE_MAN'::"CharacterAvatarPreset"
WHERE "avatar_preset" = 'QUEST_MAGE_MAN'::"CharacterAvatarPreset";

UPDATE "Character"
SET "avatar_preset" = 'MAGE_WOMAN'::"CharacterAvatarPreset"
WHERE "avatar_preset" = 'QUEST_MAGE_WOMAN'::"CharacterAvatarPreset";

DELETE FROM "InventoryItem"
WHERE "cosmetic_item_id" IN (
  SELECT "id" FROM "CosmeticItem" WHERE "key" IN ('QUEST_MAGE_MAN', 'QUEST_MAGE_WOMAN')
);

DELETE FROM "CosmeticItem"
WHERE "key" IN ('QUEST_MAGE_MAN', 'QUEST_MAGE_WOMAN');
