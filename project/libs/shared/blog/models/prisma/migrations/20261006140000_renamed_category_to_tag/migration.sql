-- RenameTable
ALTER TABLE "categories" RENAME TO "tags";
ALTER TABLE "tags" RENAME CONSTRAINT "categories_pkey" TO "tags_pkey";

-- Tags are stored in lower case
UPDATE "tags" SET "title" = lower("title");

-- DropIndex
DROP INDEX "categories_title_idx";

-- CreateIndex
CREATE UNIQUE INDEX "tags_title_key" ON "tags"("title");

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PostToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- Move relations (in "_CategoryToPost" column "A" is a category, "B" is a post)
INSERT INTO "_PostToTag" ("A", "B") SELECT "B", "A" FROM "_CategoryToPost";

-- DropTable
DROP TABLE "_CategoryToPost";

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
