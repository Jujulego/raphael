/*
  Warnings:

  - Changed the type of `state` on the `PullRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PullRequestState" AS ENUM ('Open', 'Closed', 'Merged');

-- AlterTable
ALTER TABLE "PullRequest" ALTER COLUMN "state" TYPE "PullRequestState" USING concat(upper(substr("state", 1, 1)), lower(substr("state", 2)))::"PullRequestState";
