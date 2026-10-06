-- RenameTable
ALTER TABLE "favorites" RENAME TO "likes";
ALTER TABLE "likes" RENAME CONSTRAINT "favorites_pkey" TO "likes_pkey";
ALTER TABLE "likes" RENAME CONSTRAINT "favorites_post_id_fkey" TO "likes_post_id_fkey";

-- A user can like a post only once: remove duplicates before adding the constraint
DELETE FROM "likes" a USING "likes" b
WHERE a."post_id" = b."post_id" AND a."user_id" = b."user_id" AND a."id" > b."id";

-- CreateIndex
CREATE UNIQUE INDEX "likes_post_id_user_id_key" ON "likes"("post_id", "user_id");
