-- CreateEnum
CREATE TYPE "InstallationTargetType" AS ENUM ('User');

-- CreateTable
CREATE TABLE "Installation" (
    "id" INTEGER NOT NULL,
    "target_id" INTEGER NOT NULL,
    "target_type" "InstallationTargetType" NOT NULL,
    "target_login" TEXT NOT NULL,

    CONSTRAINT "Installation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepositoriesOnInstallations" (
    "installationId" INTEGER NOT NULL,
    "repositoryOwner" TEXT NOT NULL,
    "repositoryName" TEXT NOT NULL,

    CONSTRAINT "RepositoriesOnInstallations_pkey" PRIMARY KEY ("installationId","repositoryOwner","repositoryName")
);

-- AddForeignKey
ALTER TABLE "RepositoriesOnInstallations" ADD CONSTRAINT "RepositoriesOnInstallations_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "Installation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoriesOnInstallations" ADD CONSTRAINT "RepositoriesOnInstallations_repositoryOwner_repositoryName_fkey" FOREIGN KEY ("repositoryOwner", "repositoryName") REFERENCES "Repository"("owner", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
