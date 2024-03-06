/*
  Warnings:

  - The primary key for the `email_validation_code` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `email_validation_code` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `email_validation_code` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "email_validation_code_uuid_key";

-- AlterTable
ALTER TABLE "email_validation_code" DROP CONSTRAINT "email_validation_code_pkey",
DROP COLUMN "uuid",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "email_validation_code_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "email_validation_code_id_key" ON "email_validation_code"("id");
