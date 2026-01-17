/*
  Warnings:

  - You are about to drop the column `target_id` on the `Installation` table. All the data in the column will be lost.
  - You are about to drop the column `target_login` on the `Installation` table. All the data in the column will be lost.
  - You are about to drop the column `target_type` on the `Installation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Installation" DROP COLUMN "target_id",
DROP COLUMN "target_login",
DROP COLUMN "target_type";

-- DropEnum
DROP TYPE "InstallationTargetType";
