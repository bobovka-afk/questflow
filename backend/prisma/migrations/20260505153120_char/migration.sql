-- CreateEnum
CREATE TYPE "GenderCharacter" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "SkinColorPreset" AS ENUM ('LIGHT', 'MEDIUM_LIGHT', 'MEDIUM_DARK', 'DEEP');

-- DropIndex
DROP INDEX "Board_workspaceId_idx";

-- DropIndex
DROP INDEX "Card_assigneeId_idx";

-- DropIndex
DROP INDEX "Card_listId_idx";

-- DropIndex
DROP INDEX "Comment_card_id_idx";

-- DropIndex
DROP INDEX "Comment_user_id_idx";

-- DropIndex
DROP INDEX "List_boardId_idx";

-- DropIndex
DROP INDEX "WorkspaceActivity_workspace_id_created_at_idx";

-- DropIndex
DROP INDEX "WorkspaceInvite_invitedByUserId_idx";

-- DropIndex
DROP INDEX "WorkspaceMember_userId_idx";

-- DropIndex
DROP INDEX "WorkspaceMember_workspaceId_idx";

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "GenderCharacter" NOT NULL,
    "skin_color" "SkinColorPreset" NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "health" INTEGER NOT NULL DEFAULT 100,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_config" (
    "level" INTEGER NOT NULL,
    "xp_required" INTEGER NOT NULL,

    CONSTRAINT "level_config_pkey" PRIMARY KEY ("level")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_user_id_key" ON "Character"("user_id");

-- RenameForeignKey
ALTER TABLE "AuthToken" RENAME CONSTRAINT "AuthToken_userId_fkey" TO "AuthToken_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "Board" RENAME CONSTRAINT "Board_workspaceId_fkey" TO "Board_workspace_id_fkey";

-- RenameForeignKey
ALTER TABLE "Card" RENAME CONSTRAINT "Card_assigneeId_fkey" TO "Card_assignee_id_fkey";

-- RenameForeignKey
ALTER TABLE "Card" RENAME CONSTRAINT "Card_listId_fkey" TO "Card_list_id_fkey";

-- RenameForeignKey
ALTER TABLE "List" RENAME CONSTRAINT "List_boardId_fkey" TO "List_board_id_fkey";

-- RenameForeignKey
ALTER TABLE "WorkspaceInvite" RENAME CONSTRAINT "WorkspaceInvite_invitedByUserId_fkey" TO "WorkspaceInvite_invited_by_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "WorkspaceInvite" RENAME CONSTRAINT "WorkspaceInvite_workspaceId_fkey" TO "WorkspaceInvite_workspace_id_fkey";

-- RenameForeignKey
ALTER TABLE "WorkspaceMember" RENAME CONSTRAINT "WorkspaceMember_userId_fkey" TO "WorkspaceMember_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "WorkspaceMember" RENAME CONSTRAINT "WorkspaceMember_workspaceId_fkey" TO "WorkspaceMember_workspace_id_fkey";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "AuthToken_tokenHash_key" RENAME TO "AuthToken_token_hash_key";

-- RenameIndex
ALTER INDEX "WorkspaceInvite_tokenHash_key" RENAME TO "WorkspaceInvite_token_hash_key";

-- RenameIndex
ALTER INDEX "WorkspaceInvite_workspaceId_email_key" RENAME TO "WorkspaceInvite_workspace_id_email_key";

-- RenameIndex
ALTER INDEX "WorkspaceMember_workspaceId_userId_key" RENAME TO "WorkspaceMember_workspace_id_user_id_key";
