-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "lastStreakWeek" TEXT,
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
