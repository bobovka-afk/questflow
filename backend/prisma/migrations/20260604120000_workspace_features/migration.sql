-- Workspace features: archive, labels, permissions, notifications, card reminders

CREATE TYPE "UserNotificationType" AS ENUM ('MENTION', 'DEADLINE');

ALTER TABLE "Board" ADD COLUMN "archived_at" TIMESTAMP(3);
ALTER TABLE "List" ADD COLUMN "archived_at" TIMESTAMP(3);
ALTER TABLE "Card" ADD COLUMN "reminder_minutes_before" INTEGER;
ALTER TABLE "Card" ADD COLUMN "reminder_notified_at" TIMESTAMP(3);
ALTER TABLE "WorkspaceMember" ADD COLUMN "permissions" JSONB;

CREATE TABLE "WorkspaceLabel" (
    "id" SERIAL NOT NULL,
    "workspace_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color_preset" "ListColorPreset" NOT NULL DEFAULT 'GREEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceLabel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CardLabel" (
    "card_id" INTEGER NOT NULL,
    "label_id" INTEGER NOT NULL,
    CONSTRAINT "CardLabel_pkey" PRIMARY KEY ("card_id","label_id")
);

CREATE TABLE "UserNotification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "UserNotificationType" NOT NULL,
    "payload" JSONB NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WorkspaceLabel_workspace_id_name_key" ON "WorkspaceLabel"("workspace_id", "name");
CREATE INDEX "UserNotification_user_id_created_at_idx" ON "UserNotification"("user_id", "created_at");
CREATE INDEX "UserNotification_user_id_read_at_idx" ON "UserNotification"("user_id", "read_at");

ALTER TABLE "WorkspaceLabel" ADD CONSTRAINT "WorkspaceLabel_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardLabel" ADD CONSTRAINT "CardLabel_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardLabel" ADD CONSTRAINT "CardLabel_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "WorkspaceLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
