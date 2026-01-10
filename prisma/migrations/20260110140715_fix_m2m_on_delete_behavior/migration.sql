-- DropForeignKey
ALTER TABLE "RepositoriesOnInstallations" DROP CONSTRAINT "RepositoriesOnInstallations_installationId_fkey";

-- DropForeignKey
ALTER TABLE "RepositoriesOnInstallations" DROP CONSTRAINT "RepositoriesOnInstallations_repositoryOwner_repositoryName_fkey";

-- AddForeignKey
ALTER TABLE "RepositoriesOnInstallations" ADD CONSTRAINT "RepositoriesOnInstallations_installationId_fkey" FOREIGN KEY ("installationId") REFERENCES "Installation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoriesOnInstallations" ADD CONSTRAINT "RepositoriesOnInstallations_repositoryOwner_repositoryName_fkey" FOREIGN KEY ("repositoryOwner", "repositoryName") REFERENCES "Repository"("owner", "name") ON DELETE CASCADE ON UPDATE CASCADE;
