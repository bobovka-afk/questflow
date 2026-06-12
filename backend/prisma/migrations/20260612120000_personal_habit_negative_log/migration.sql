CREATE TABLE "PersonalHabitNegativeLog" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "personal_habit_id" INTEGER NOT NULL,
    "day_key" DATE NOT NULL,
    "hp_delta" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PersonalHabitNegativeLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PersonalHabitNegativeLog_user_id_personal_habit_id_day_key_key"
  ON "PersonalHabitNegativeLog"("user_id", "personal_habit_id", "day_key");
CREATE INDEX "PersonalHabitNegativeLog_user_id_day_key_idx"
  ON "PersonalHabitNegativeLog"("user_id", "day_key");

ALTER TABLE "PersonalHabitNegativeLog" ADD CONSTRAINT "PersonalHabitNegativeLog_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalHabitNegativeLog" ADD CONSTRAINT "PersonalHabitNegativeLog_personal_habit_id_fkey"
  FOREIGN KEY ("personal_habit_id") REFERENCES "PersonalHabit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
