-- Email change confirmation tokens (old + new address)
ALTER TYPE "AuthTokenType" ADD VALUE IF NOT EXISTS 'EMAIL_CHANGE_OLD';
ALTER TYPE "AuthTokenType" ADD VALUE IF NOT EXISTS 'EMAIL_CHANGE_NEW';
