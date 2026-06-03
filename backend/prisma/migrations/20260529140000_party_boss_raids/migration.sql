-- Party boss raids + character mana

CREATE TYPE "PartyRaidStatus" AS ENUM ('INVITING', 'ACTIVE', 'DEFEATED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "PartyMemberStatus" AS ENUM ('INVITED', 'ACTIVE', 'KICKED', 'LEFT', 'DECLINED');
CREATE TYPE "PartyMemberRole" AS ENUM ('LEADER', 'MEMBER');
CREATE TYPE "PartyKickVoteStatus" AS ENUM ('OPEN', 'PASSED', 'REJECTED');

ALTER TABLE "Character" ADD COLUMN "mana_current" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "PartyRaid" (
    "id" SERIAL NOT NULL,
    "boss_key" TEXT NOT NULL,
    "leader_id" INTEGER NOT NULL,
    "status" "PartyRaidStatus" NOT NULL DEFAULT 'INVITING',
    "remaining_pct" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "started_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "defeated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartyRaid_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartyRaidMember" (
    "id" SERIAL NOT NULL,
    "raid_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "PartyMemberRole" NOT NULL,
    "status" "PartyMemberStatus" NOT NULL DEFAULT 'INVITED',
    "contribution_pct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "joined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartyRaidMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartyRaidHit" (
    "id" SERIAL NOT NULL,
    "raid_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "damage_pct" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartyRaidHit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartyKickVote" (
    "id" SERIAL NOT NULL,
    "raid_id" INTEGER NOT NULL,
    "target_user_id" INTEGER NOT NULL,
    "initiator_id" INTEGER NOT NULL,
    "status" "PartyKickVoteStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "PartyKickVote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PartyKickBallot" (
    "id" SERIAL NOT NULL,
    "vote_id" INTEGER NOT NULL,
    "voter_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartyKickBallot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PartyRaidMember_raid_id_user_id_key" ON "PartyRaidMember"("raid_id", "user_id");
CREATE INDEX "PartyRaidMember_user_id_status_idx" ON "PartyRaidMember"("user_id", "status");
CREATE INDEX "PartyRaid_leader_id_status_idx" ON "PartyRaid"("leader_id", "status");
CREATE INDEX "PartyRaid_status_expires_at_idx" ON "PartyRaid"("status", "expires_at");
CREATE INDEX "PartyRaidHit_raid_id_created_at_idx" ON "PartyRaidHit"("raid_id", "created_at");
CREATE INDEX "PartyKickVote_raid_id_status_idx" ON "PartyKickVote"("raid_id", "status");
CREATE UNIQUE INDEX "PartyKickBallot_vote_id_voter_id_key" ON "PartyKickBallot"("vote_id", "voter_id");

ALTER TABLE "PartyRaid" ADD CONSTRAINT "PartyRaid_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyRaidMember" ADD CONSTRAINT "PartyRaidMember_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "PartyRaid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyRaidMember" ADD CONSTRAINT "PartyRaidMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyRaidHit" ADD CONSTRAINT "PartyRaidHit_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "PartyRaid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyRaidHit" ADD CONSTRAINT "PartyRaidHit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyKickVote" ADD CONSTRAINT "PartyKickVote_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "PartyRaid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyKickVote" ADD CONSTRAINT "PartyKickVote_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyKickBallot" ADD CONSTRAINT "PartyKickBallot_vote_id_fkey" FOREIGN KEY ("vote_id") REFERENCES "PartyKickVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PartyKickBallot" ADD CONSTRAINT "PartyKickBallot_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
