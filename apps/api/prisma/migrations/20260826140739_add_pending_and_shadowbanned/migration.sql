-- AlterEnum
ALTER TYPE "CommentStatus" ADD VALUE 'PENDING';

-- AlterEnum
ALTER TYPE "PostStatus" ADD VALUE 'PENDING';

-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'SHADOWBANNED';

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'PENDING';
