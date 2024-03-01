/*
  Warnings:

  - You are about to drop the column `user_id` on the `search` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_vehicles` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `has_active_notifications` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "search" DROP CONSTRAINT "search_user_id_fkey";

-- AlterTable
ALTER TABLE "search" DROP COLUMN "user_id",
ADD COLUMN     "account_id" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "favorite_vehicles",
DROP COLUMN "has_active_notifications",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "has_active_notifications" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "favorite_vehicles" TEXT[],
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "account_id_key" ON "account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_userId_key" ON "account"("userId");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search" ADD CONSTRAINT "search_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
