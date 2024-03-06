/*
  Warnings:

  - Added the required column `notificationStatus` to the `email_validation_code` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('READY_TO_SEND', 'FAILED', 'SENT');

-- AlterTable
ALTER TABLE "email_validation_code" ADD COLUMN     "notificationStatus" "NotificationStatus" NOT NULL;
