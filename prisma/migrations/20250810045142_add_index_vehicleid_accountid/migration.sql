/*
  Warnings:

  - A unique constraint covering the columns `[vehicleId,accountId]` on the table `favorite_vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "favorite_vehicle_vehicleId_accountId_key" ON "favorite_vehicle"("vehicleId", "accountId");
