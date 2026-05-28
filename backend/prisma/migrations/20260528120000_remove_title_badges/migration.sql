-- Значки титула (TITLE_BADGE) сняты с продукта: лут, инвентарь, экипировка.
UPDATE "Character"
SET "equipped_title_badge_key" = NULL
WHERE "equipped_title_badge_key" IS NOT NULL;

DELETE FROM "InventoryItem"
WHERE "cosmetic_item_id" IN (
  SELECT "id" FROM "CosmeticItem" WHERE "type" = 'TITLE_BADGE'
);

DELETE FROM "CosmeticItem" WHERE "type" = 'TITLE_BADGE';
