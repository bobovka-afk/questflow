-- User settings, sessions, and security audit log

CREATE TYPE "UserSecurityEventType" AS ENUM (
  'PASSWORD_CHANGED',
  'PASSWORD_SET',
  'PASSWORD_RESET',
  'SESSION_CREATED',
  'SESSION_REVOKED',
  'SESSIONS_REVOKED_ALL_OTHER',
  'GAMIFICATION_SETTINGS_CHANGED',
  'SITE_SETTINGS_CHANGED',
  'SECURITY_SETTINGS_CHANGED',
  'EMAIL_CHANGE_REQUESTED',
  'EMAIL_CHANGED'
);

CREATE TABLE "UserSettings" (
  "user_id" INTEGER NOT NULL,
  "gamification" JSONB NOT NULL DEFAULT '{"checkinAnimationOnCardClose":true,"xpGainNotifications":true}'::jsonb,
  "site" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "security" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("user_id")
);

CREATE TABLE "UserSession" (
  "id" TEXT NOT NULL,
  "user_id" INTEGER NOT NULL,
  "refresh_token_hash" TEXT NOT NULL,
  "user_agent" TEXT,
  "ip_address" TEXT,
  "device_label" TEXT,
  "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),

  CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserSecurityEvent" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "type" "UserSecurityEventType" NOT NULL,
  "metadata" JSONB,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "session_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "UserSecurityEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSession_refresh_token_hash_key" ON "UserSession"("refresh_token_hash");
CREATE INDEX "UserSession_user_id_idx" ON "UserSession"("user_id");
CREATE INDEX "UserSession_user_id_revoked_at_idx" ON "UserSession"("user_id", "revoked_at");
CREATE INDEX "UserSecurityEvent_user_id_created_at_idx" ON "UserSecurityEvent"("user_id", "created_at" DESC);

ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserSecurityEvent" ADD CONSTRAINT "UserSecurityEvent_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserSecurityEvent" ADD CONSTRAINT "UserSecurityEvent_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "UserSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "UserSettings" ("user_id", "gamification", "site", "security", "updated_at")
SELECT
  "id",
  '{"checkinAnimationOnCardClose":true,"xpGainNotifications":true}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  CURRENT_TIMESTAMP
FROM "User"
ON CONFLICT ("user_id") DO NOTHING;
