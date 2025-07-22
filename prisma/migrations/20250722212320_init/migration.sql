-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('WAITING', 'READY_TO_SEND', 'FAILED', 'SENT');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT,
    "lat_session" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "has_confirmed_email" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "has_active_notifications" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_vehicle" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "deletedNotificationStatus" "NotificationStatus" NOT NULL DEFAULT 'WAITING',
    "accountId" TEXT,

    CONSTRAINT "favorite_vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "notificationStatus" "NotificationStatus" NOT NULL,
    "expiration_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "email_verification_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_id_key" ON "account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_userId_key" ON "account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_vehicle_id_key" ON "favorite_vehicle"("id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_code_id_key" ON "email_verification_code"("id");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_vehicle" ADD CONSTRAINT "favorite_vehicle_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_code" ADD CONSTRAINT "email_verification_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
