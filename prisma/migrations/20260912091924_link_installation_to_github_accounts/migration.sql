-- AlterTable
ALTER TABLE "Installation"
    ADD COLUMN "accountId"     TEXT,
    ADD COLUMN "accountIssuer" TEXT,
    ADD CONSTRAINT "Installation_accountIssuer_check" CHECK ( "accountIssuer" = 'local:oauth:github' );

-- AddForeignKey
ALTER TABLE "Installation"
    ADD CONSTRAINT "Installation_accountId_accountIssuer_fkey" FOREIGN KEY ("accountId", "accountIssuer") REFERENCES "Account" ("accountId", "issuer") ON DELETE CASCADE ON UPDATE CASCADE;
