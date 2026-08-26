/*
  Warnings:

  - You are about to drop the column `entry_id` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `journal_entries` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('ACTIVE', 'HIDDEN');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_entry_id_fkey";

-- DropIndex
DROP INDEX "comments_entry_id_created_at_idx";

-- Clear comments: cannot map entry_id → post_id (posts did not exist yet)
DELETE FROM "comments";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "entry_id",
ADD COLUMN     "post_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "journal_entries" DROP COLUMN "visibility";

-- DropEnum
DROP TYPE "EntryVisibility";

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "journal_entry_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mood" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "PostStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_journal_entry_id_key" ON "posts"("journal_entry_id");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");

-- CreateIndex
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
