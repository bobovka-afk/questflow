-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable: friend_code (nullable → backfill → NOT NULL)
ALTER TABLE "Character" ADD COLUMN "friend_code" INTEGER;

DO $$
DECLARE
  r RECORD;
  code INT;
  attempts INT;
  taken BOOLEAN;
BEGIN
  FOR r IN SELECT id FROM "Character" WHERE friend_code IS NULL LOOP
    attempts := 0;
    LOOP
      code := 1000 + floor(random() * 9000)::int;
      SELECT EXISTS(SELECT 1 FROM "Character" WHERE friend_code = code) INTO taken;
      EXIT WHEN NOT taken;
      attempts := attempts + 1;
      IF attempts > 200 THEN
        RAISE EXCEPTION 'Could not assign friend_code for character %', r.id;
      END IF;
    END LOOP;
    UPDATE "Character" SET friend_code = code WHERE id = r.id;
  END LOOP;
END $$;

ALTER TABLE "Character" ALTER COLUMN "friend_code" SET NOT NULL;

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" SERIAL NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "addressee_id" INTEGER NOT NULL,
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DirectMessage" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "body" VARCHAR(2000) NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_friend_code_key" ON "Character"("friend_code");

CREATE UNIQUE INDEX "FriendRequest_requester_id_addressee_id_key" ON "FriendRequest"("requester_id", "addressee_id");

CREATE INDEX "FriendRequest_addressee_id_status_idx" ON "FriendRequest"("addressee_id", "status");

CREATE INDEX "FriendRequest_requester_id_status_idx" ON "FriendRequest"("requester_id", "status");

CREATE INDEX "DirectMessage_recipient_id_read_at_idx" ON "DirectMessage"("recipient_id", "read_at");

CREATE INDEX "DirectMessage_recipient_id_created_at_idx" ON "DirectMessage"("recipient_id", "created_at");

CREATE INDEX "DirectMessage_sender_id_recipient_id_created_at_idx" ON "DirectMessage"("sender_id", "recipient_id", "created_at");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_addressee_id_fkey" FOREIGN KEY ("addressee_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
