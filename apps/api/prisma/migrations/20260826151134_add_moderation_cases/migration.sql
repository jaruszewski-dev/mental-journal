-- CreateEnum
CREATE TYPE "ModerationCaseStatus" AS ENUM ('OPEN', 'BANNED', 'DISMISSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ModerationCaseTrigger" AS ENUM ('TRUST_THRESHOLD', 'SHADOWBAN_REPEAT_BLOCK');

-- CreateTable
CREATE TABLE "moderation_cases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "ModerationCaseStatus" NOT NULL DEFAULT 'OPEN',
    "trigger" "ModerationCaseTrigger" NOT NULL,
    "reason" TEXT NOT NULL,
    "trust_score_snapshot" INTEGER NOT NULL,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "resolved_by_id" TEXT,
    "resolution_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moderation_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_evidence" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "content_snapshot" TEXT,
    "ai_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "moderation_cases_status_opened_at_idx" ON "moderation_cases"("status", "opened_at");

-- CreateIndex
CREATE INDEX "moderation_cases_user_id_opened_at_idx" ON "moderation_cases"("user_id", "opened_at");

-- CreateIndex
CREATE INDEX "moderation_evidence_case_id_idx" ON "moderation_evidence"("case_id");

-- AddForeignKey
ALTER TABLE "moderation_cases" ADD CONSTRAINT "moderation_cases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_cases" ADD CONSTRAINT "moderation_cases_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_evidence" ADD CONSTRAINT "moderation_evidence_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "moderation_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_evidence" ADD CONSTRAINT "moderation_evidence_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderation_evidence" ADD CONSTRAINT "moderation_evidence_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
