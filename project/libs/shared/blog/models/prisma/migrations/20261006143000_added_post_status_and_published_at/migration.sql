-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('published', 'draft');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN "status" "PostStatus" NOT NULL DEFAULT 'published',
ADD COLUMN "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- For existing posts the publication date equals the creation date
UPDATE "posts" SET "published_at" = "created_at";

-- CreateIndex
CREATE INDEX "posts_published_at_idx" ON "posts"("published_at");
