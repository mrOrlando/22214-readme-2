-- AlterTable
ALTER TABLE "posts" ADD COLUMN "is_repost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "original_post_id" TEXT,
ADD COLUMN "original_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "posts_user_id_original_post_id_key" ON "posts"("user_id", "original_post_id");
