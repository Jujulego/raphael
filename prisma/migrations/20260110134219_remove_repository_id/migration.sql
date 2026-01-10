/*
  Warnings:

  - The primary key for the `Repository` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Repository` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Repository_owner_name_key";

-- AlterTable
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_pkey",
DROP COLUMN "id",
ALTER COLUMN "issueCount" SET DEFAULT 0,
ALTER COLUMN "pullRequestCount" SET DEFAULT 0,
ADD CONSTRAINT "Repository_pkey" PRIMARY KEY ("owner", "name");
