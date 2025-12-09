-- AlterTable
ALTER TABLE "public"."gyms" ADD COLUMN     "address" TEXT,
ADD COLUMN     "rating" DECIMAL(65,30) DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;
