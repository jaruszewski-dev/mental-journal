-- CreateEnum
CREATE TYPE "PreferredLocale" AS ENUM ('pl', 'en');

-- AlterTable
ALTER TABLE "user" ADD COLUMN "preferred_locale" "PreferredLocale" NOT NULL DEFAULT 'pl';
