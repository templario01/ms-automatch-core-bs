-- AlterTable
ALTER TABLE "account" ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "email_verification_code" ADD CONSTRAINT "email_verification_code_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "search" ADD CONSTRAINT "search_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
