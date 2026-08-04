-- CreateTable
CREATE TABLE "PullRequest" (
    "repositoryOwner" TEXT NOT NULL,
    "repositoryName" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "htmlUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PullRequest_pkey" PRIMARY KEY ("repositoryOwner","repositoryName","number")
);

-- CreateIndex
CREATE INDEX "PullRequest_repositoryOwner_repositoryName_state_idx" ON "PullRequest"("repositoryOwner", "repositoryName", "state");

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repositoryOwner_repositoryName_fkey" FOREIGN KEY ("repositoryOwner", "repositoryName") REFERENCES "Repository"("owner", "name") ON DELETE CASCADE ON UPDATE CASCADE;
