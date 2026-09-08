-- RenameTable
ALTER TABLE "account" RENAME TO "Account";
ALTER TABLE "Account" RENAME CONSTRAINT "account_pkey" TO "Account_pkey";

-- RenameForeignKey
ALTER TABLE "Account" RENAME CONSTRAINT "account_userId_fkey" TO "Account_userId_fkey";

-- RenameIndex
ALTER INDEX "account_userId_idx" RENAME TO "Account_userId_idx";

-- RenameIndex
ALTER INDEX "account_issuer_accountId_uidx" RENAME TO "Account_issuer_accountId_uidx";

-- RenameTable
ALTER TABLE "session" RENAME TO "Session";
ALTER TABLE "Session" RENAME CONSTRAINT "session_pkey" TO "Session_pkey";

-- RenameForeignKey
ALTER TABLE "Session" RENAME CONSTRAINT "session_userId_fkey" TO "Session_userId_fkey";

-- RenameIndex
ALTER INDEX "session_userId_idx" RENAME TO "Session_userId_idx";

-- RenameIndex
ALTER INDEX "session_token_key" RENAME TO "Session_token_key";

-- RenameTable
ALTER TABLE "user" RENAME TO "User";
ALTER TABLE "User" RENAME CONSTRAINT "user_pkey" TO "User_pkey";

-- RenameIndex
ALTER INDEX "user_email_key" RENAME TO "User_email_key";

-- RenameTable
ALTER TABLE "verification" RENAME TO "Verification";
ALTER TABLE "Verification" RENAME CONSTRAINT "verification_pkey" TO "Verification_pkey";

-- RenameIndex
ALTER INDEX "verification_identifier_idx" RENAME TO "Verification_identifier_idx";
