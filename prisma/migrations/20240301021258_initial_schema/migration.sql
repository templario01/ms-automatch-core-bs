-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "has_confirmed_email" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT,
    "has_active_notifications" BOOLEAN NOT NULL DEFAULT false,
    "lat_session" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "favorite_vehicles" TEXT[]
);

-- CreateTable
CREATE TABLE "search" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "search" JSONB NOT NULL,
    "user_id" TEXT
);

-- CreateTable
CREATE TABLE "email_validation_code" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiration_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "email_validation_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "search_id_key" ON "search"("id");

-- CreateIndex
CREATE UNIQUE INDEX "email_validation_code_uuid_key" ON "email_validation_code"("uuid");

-- AddForeignKey
ALTER TABLE "search" ADD CONSTRAINT "search_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_validation_code" ADD CONSTRAINT "email_validation_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
