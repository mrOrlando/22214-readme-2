-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('video', 'text', 'quote', 'photo', 'link');

-- Existing posts become "text" posts: description -> announcement, content -> text
ALTER TABLE "posts" RENAME COLUMN "description" TO "announcement";
ALTER TABLE "posts" RENAME COLUMN "content" TO "text";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN "type" "PostType" NOT NULL DEFAULT 'text',
ADD COLUMN "video_url" TEXT,
ADD COLUMN "quote_text" TEXT,
ADD COLUMN "quote_author" TEXT,
ADD COLUMN "photo" TEXT,
ADD COLUMN "link_url" TEXT,
ADD COLUMN "link_description" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "announcement" DROP NOT NULL,
ALTER COLUMN "text" DROP NOT NULL;

ALTER TABLE "posts" ALTER COLUMN "type" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "posts_type_idx" ON "posts"("type");

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");
