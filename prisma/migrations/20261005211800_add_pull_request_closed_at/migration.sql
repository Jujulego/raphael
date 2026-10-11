-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN "closedAt" TIMESTAMP(3);

-- Backfill closed pull requests with their last update timestamp.
UPDATE "PullRequest"
SET "closedAt" = "updatedAt"
WHERE "state" <> 'OPEN';
