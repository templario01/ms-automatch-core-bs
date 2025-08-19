-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "auth_providers" "AuthProvider"[] DEFAULT ARRAY['LOCAL']::"AuthProvider"[],
ADD COLUMN     "name" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
