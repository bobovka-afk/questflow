-- CreateEnum
CREATE TYPE "HealthEventReason" AS ENUM ('INACTIVITY_PENALTY');

-- CreateTable
CREATE TABLE "HealthEvent" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "day_key" DATE NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" "HealthEventReason" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthEvent_user_id_day_key_reason_key" ON "HealthEvent"("user_id", "day_key", "reason");

-- AddForeignKey
ALTER TABLE "HealthEvent" ADD CONSTRAINT "HealthEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
