/*
  Warnings:

  - You are about to drop the column `comments_enabled` on the `journal_entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "journal_entries" DROP COLUMN "comments_enabled";
