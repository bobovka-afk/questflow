-- frame_mystic: в сиде quests_and_chests был только frame_epic_flame; лут и UI используют frame_mystic.
INSERT INTO "CosmeticItem" ("type", "key", "tier", "name_ru")
VALUES ('PORTRAIT_FRAME', 'frame_mystic', 'EPIC', 'Мистическая рамка')
ON CONFLICT ("key") DO NOTHING;
