/*
  Warnings:

  - You are about to drop the column `favorite_vehicles` on the `account` table. All the data in the column will be lost.
  - You are about to drop the `search` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "NotificationStatus" ADD VALUE 'WAITING';

-- DropForeignKey
ALTER TABLE "search" DROP CONSTRAINT "search_account_id_fkey";

-- AlterTable
ALTER TABLE "account" DROP COLUMN "favorite_vehicles";

-- DropTable
DROP TABLE "search";

-- CreateTable
CREATE TABLE "favorite_vehicle" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "deletedNotificationStatus" "NotificationStatus" NOT NULL DEFAULT 'WAITING',
    "accountId" TEXT,

    CONSTRAINT "favorite_vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_vehicle_id_key" ON "favorite_vehicle"("id");

-- AddForeignKey
ALTER TABLE "favorite_vehicle" ADD CONSTRAINT "favorite_vehicle_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
