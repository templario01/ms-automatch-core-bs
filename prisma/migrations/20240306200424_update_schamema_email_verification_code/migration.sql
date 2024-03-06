/*
  Warnings:

  - You are about to drop the `email_validation_code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "email_validation_code" DROP CONSTRAINT "email_validation_code_user_id_fkey";

-- DropTable
DROP TABLE "email_validation_code";

-- CreateTable
CREATE TABLE "email_verification_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "notificationStatus" "NotificationStatus" NOT NULL,
    "expiration_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_code_id_key" ON "email_verification_code"("id");

-- AddForeignKey
ALTER TABLE "email_verification_code" ADD CONSTRAINT "email_verification_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
